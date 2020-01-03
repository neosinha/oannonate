'''
Created on Mar 31, 2019

@author: navendusinha
'''
# -*- coding: utf-8 -*-

import cherrypy as HttpServer
from pymongo import MongoClient
import logging
import json, magic
from zipfile import ZipFile
import argparse, datetime, time, os, sys, shutil
import threading

# Initalize logging module
logging.basicConfig(filename='annonserver.log',level=logging.DEBUG, format='%(asctime)s %(message)s')
handler = logging.StreamHandler(sys.stdout)
logging.getLogger().addHandler(handler)


class OAServelet(object):
    '''
    classdocs
    '''

    def __init__(self, www=None, dbhost=None):
        '''
        Constructor
        '''

        # Handle Static Directory Defintion
        self.staticdir = os.path.join(os.getcwd(), 'ui_www')
        if www: 
            self.staticdir = www
        self.uploaddir = os.path.join(os.getcwd(), 'uploads')
        logging.info("Static directory: %s" % (self.staticdir))

        # Handle MongoDB Client defintions
        self.dbhost = '127.0.0.1'
        if not dbhost is None:
            self.dbhost = dbhost

        client = MongoClient(self.dbhost, 27017)
        self.db = client['oannontate']
        self.pics = self.db['imagerepo']


    @HttpServer.expose
    def index(self):
        """
        Route file route
        """
        return open(os.path.join(self.staticdir, "index.html"))
    
    @HttpServer.expose
    def imgupload(self, upfile):
        """
        Handles image upload
        :return:
        """
        uptstamp = self.epoch()
        self.uploaddir = os.path.join(self.staticdir, 'uploads')
        print("UploadFile: Name: %s, Type: %s " % (upfile.filename, upfile.content_type))
        fext = str(upfile.content_type).split('/')[1]
        print("Extension: %s" % (fext))

        if not os.path.exists(self.uploaddir):
            logging.info('Upload directory does not exist, creating %s' % (self.uploaddir))
            os.makedirs(self.uploaddir)

        if upfile is not None:
            tsx = self.epoch()
            ofile = os.path.join(self.uploaddir, "%s.%s" % (tsx, fext))
            print("Local filename: %s" % (ofile))
            ofilex = open(ofile, "wb")
            shutil.copyfileobj(upfile.file, ofilex)
            logging.info("Copied uploaded file as %s" % (ofile))
            ofilex.close()
            enstamp = self.epoch()
            self.unpack(localfile=ofile)

            out = {"start": uptstamp,
                   'upimg': "%s.%s" % (tsx, fext),
                   'end': enstamp}

            return json.dumps(out)
        else:
            return "Parameter: \"theFile\" was not defined"

    def unpack(self, localfile=None):
        """
        Check and UNZP files
        :return:
        """
        if localfile:
            print("Unpacking LocalFile: {}".format(localfile))
            ftype = magic.from_file(localfile, mime=True)
            print("%s " % (ftype))

            # Uncompress in the storage location
            # TODO: Limit the directory size by nuber of files so that
            ddmmyy = str(datetime.datetime.utcnow()).split(" ")[0]
            print("Date: {}".format(ddmmyy))
            ucompressLocation = os.path.join(self.staticdir, 'imagerepo', ddmmyy)
            if not os.path.exists(ucompressLocation):
                os.makedirs(ucompressLocation)

            if 'gzip' in str(ftype):
                print("GZIP Type: {}".format(ftype))
            elif 'zip' in str(ftype):
                print('ZIP file type: {}'.format(ftype))
                with ZipFile(localfile, 'r') as zipobj:
                    zipobj.extractall(path=ucompressLocation)
                    classname = ''
                    for infoitem in zipobj.infolist():
                        # print("\t%s, %s" % (infoitem.filename, infoitem.compress_type))
                        print("\t%s" % (infoitem))
                        print("\t=== %s" % (infoitem.compress_type))
                        if infoitem.compress_type == 0:
                            print("ClassName: %s" % (infoitem.filename))
                            classnamex = infoitem.filename.split('/')
                            classname = classnamex[0]

                        if not '__MACOSX' in infoitem.filename and infoitem.compress_type != 0:
                            print("\t%s" % (infoitem))
                            print(infoitem.filename)

                            fobj = {'filename': os.path.join('imagerepo', ddmmyy, infoitem.filename),
                                    'class': classname,
                                    'size': infoitem.file_size,
                                    'md5': '',
                                    'date': ddmmyy
                                    }
                            print("FileObj: {}".format(fobj))
                            res = self.pics.update(fobj, fobj, upsert=True)
                            print('DBInsert: %s' % (res))

    @HttpServer.expose
    def getimageclasses(self):
        """
        Returns list of image classes
        :return:
        """
        classes = list()
        dclasses = self.pics.distinct('class')
        for classx in dclasses:
            print(classx)
            dbquery = self.pics.find({'class': classx}, {'_id': 0})
            classes.append({'name': classx,
                            'count': dbquery.count()})
        return json.dumps(classes)



    def epoch(self):
        """
        Returns Unix Epoch
        """
        epc = int(time.time() * 1000)
        return epc





# main code section   
if __name__ == '__main__':
    
    portnum = 9005
    www = os.path.join(os.getcwd(), '..', 'ui_www')
    ipadd = '127.0.0.1'
    dbip = '127.0.0.1'
    
    ap = argparse.ArgumentParser()  
    ap.add_argument("-p", "--port", required=False, default=portnum,
                help="Port number to start HTTPServer, defaults to {}".format(portnum))

    ap.add_argument("-i", "--ipaddress", required=False, default=ipadd,
                help="IP Address to start HTTPServer, defaults to {}".format(ipadd))

    ap.add_argument("-d", "--mongo", required=False, default=dbip,
                help="IP Address for MongoDB server, defaults to {}".format(dbip))
    
    ap.add_argument("-s", "--static", required=False, default=www,
                help="Static directory where WWW files are present, {}".format(www))

    args = vars(ap.parse_args())

    if args['port']:
        portnum = int(args["port"])

    if args['ipaddress']:
        ipadd = args["ipaddress"]

    if args['mongo']:
        dbadd = args["mongo"]

    if args['static']:
        staticwww = os.path.abspath(args['static'])
    
    

    HttpServer.config.update({'server.socket_host' : ipadd,
                          'server.socket_port': portnum, 
                          'server.socket_timeout': 60,
                          'server.thread_pool' : 8, 
                          'server.max_request_body_size': 0
                          })
    static_dir = staticwww
    
    logging.info("Static dir: %s " % (static_dir))
    conf = {
        '/': {
            'tools.sessions.on': True,
            'tools.staticdir.on': True,
            'tools.staticdir.dir': static_dir
        }
    }

    HttpServer.quickstart(OAServelet(www=static_dir, dbhost='23.236.252.10'),
                               '/', conf)

