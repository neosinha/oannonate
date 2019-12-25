'''
Created on Mar 31, 2019

@author: navendusinha
'''
# -*- coding: utf-8 -*-

import cherrypy as HttpServer
from pymongo import MongoClient
import logging
import json
import argparse,time, os, sys, shutil


# Initalize logging module
logging.basicConfig(filename='annonserver.log',level=logging.DEBUG, format='%(asctime)s %(message)s')
handler = logging.StreamHandler(sys.stdout)
logging.getLogger().addHandler(handler)


class OAServelet(object):
    '''
    classdocs
    '''


    def __init__(self, www):
        '''
        Constructor
        '''
        # write your class code here
        self.staticdir = os.path.join(os.getcwd(), 'ui_www')
        if www: 
            self.staticdir = www
        
        self.uploaddir = os.path.join(os.getcwd(), 'uploads')
        
        logging.info("Static directory: %s" % (self.staticdir))
        
    @HttpServer.expose
    def index(self):
        """
        Satisfies root file
        """
        return open(os.path.join(self.staticdir, "index.html"))
    
    
    @HttpServer.expose
    def imgupload(self, file):
        """
        Handles image upload
        :return:
        """
        uptstamp = self.epoch()
        upfile = file
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
            logging.info("Copied uploaded file as %s" % (ofilex))
            ofilex.close()
            enstamp = self.epoch()
            wwwbase = os.path.basename(self.staticdir)


            out = {"start": uptstamp,
                   'upimg': "%s.%s" % (tsx, fext),
                   'end': enstamp}

            return json.dumps(out)
        else:
            return "Parameter: \"theFile\" was not defined"

   
    
    def epoch(self):
        """
        Returns Unix Epoch
        """
        epc = int(time.time()*1000)
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
    
    HttpServer.quickstart(OAServelet(www=static_dir),
                               '/', conf)

