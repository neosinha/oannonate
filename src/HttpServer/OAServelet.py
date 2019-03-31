'''
Created on Mar 31, 2019

@author: navendusinha
'''
# -*- coding: utf-8 -*-

import cherrypy as OAServer
# from pymongo import MongoClient

import argparse, time, os


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
        
        print("Static directory: %s" % (self.staticdir))
        
    
    @OAServer.expose
    def index(self):
        """
        Satisfies root file
        """
        return open(os.path.join(self.staticdir, "index.html"))
    
    
    def epoch(self):
        """
        Returns Unix Epoch
        """
        epc = int(time.time()*1000)
        return epc 

           

# main code section   
if __name__ == '__main__':
    port = 9005
    www = os.path.join(os.getcwd(), 'www')
    ipaddr = '127.0.0.1'
    dbip = '127.0.0.1'
    
    ap = argparse.ArgumentParser()  
    ap.add_argument("-p", "--port", required=False,
                help="Port number to start HTTPServer." )

    ap.add_argument("-i", "--ipaddress", required=False,
                help="IP Address to start HTTPServer")

    ap.add_argument("-d", "--mongo", required=False,
                help="IP Address for MongoDB server")
    
    ap.add_argument("-s", "--static", required=False,
                help="Static directory where WWW files are present")

    args = vars(ap.parse_args())
    
    portnum = int(args["port"])
    ipadd = args["ipaddress"]
    dbadd = args["mongo"]
    staticwww = os.path.abspath(args['static'])
    
    

    OAServer.config.update({ 'server.socket_host' : ipadd,
                          'server.socket_port': portnum, 
                          'server.socket_timeout': 60,
                          'server.thread_pool' : 8, 
                          'server.max_request_body_size': 0 
                          })
    
    
    # static_dir = os.path.join(os.getcwd(), '..' ,'www')
    static_dir = staticwww
    print("Static dir: %s " % (static_dir))
    conf = {
        '/': {
            'tools.sessions.on': True,
            'tools.staticdir.on': True,
            'tools.staticdir.dir': static_dir
        }
    }
    
    OAServer.quickstart(OAServelet(www=static_dir),
                               '/', conf)
    


        
        

        
     