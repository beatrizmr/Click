
# ImageEditor.py
# Copyright (C) 2008 Peter Frueh (http://www.ajaxprogrammer.com/)
# 
# This library is free software; you can redistribute it and/or
# modify it under the terms of the GNU Lesser General Public
# License as published by the Free Software Foundation; either
# version 2.1 of the License, or (at your option) any later version.
# 
# This library is distributed in the hope that it will be useful,
# but WITHOUT ANY WARRANTY; without even the implied warranty of
# MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU
# Lesser General Public License for more details.
# 
# You should have received a copy of the GNU Lesser General Public
# License along with this library; if not, write to the Free Software
# Foundation, Inc., 51 Franklin Street, Fifth Floor, Boston, MA  02110-1301  USA


# DEPENDENCIES
import os
import cgi
import wsgiref.handlers
from google.appengine.ext import webapp
from google.appengine.ext.webapp import template
from google.appengine.ext import db
from google.appengine.api import users
from google.appengine.api import images
from getimageinfo import getImageInfo


# DATA MODELS
class Image(db.Model):
    user = db.UserProperty()
    data = db.BlobProperty()
    output_encoding = db.IntegerProperty()
    content_type = db.StringProperty()
    width = db.IntegerProperty()
    height = db.IntegerProperty()


# REQUEST HANDLERS
class MainHandler(webapp.RequestHandler):
    def get(self):
        
        #check login
        if not users.get_current_user():
            self.redirect(users.create_login_url(self.request.uri))

        template_values = {
            'logout_url': users.create_logout_url("/")
        }        
        path = os.path.join(os.path.dirname(__file__), 'index.html')
        self.response.out.write(template.render(path, template_values))

class UploadHandler(webapp.RequestHandler):
    def post(self):

        #check login
        if not users.get_current_user():
            self.redirect(users.create_login_url('/'))
        
        img = self.request.get('img')
        content_type, width, height = getImageInfo(img)
        
        # input validation
        if not img or not content_type:
            self.redirect('/')
            return

        # delete previous image, if exists
        user = users.get_current_user()
        query = db.GqlQuery("SELECT * FROM Image WHERE user = :1", user)
        for image in query:
            db.delete(image)
            
        image = Image()
        image.user = user
        image.data = db.Blob(img)
        if content_type == "image/jpeg":
            image.content_type = "image/jpeg"
            image.output_encoding = images.JPEG
        else:
            # GIFs, etc. get converted to PNG since only JPEG and PNG are currently supported
            image.content_type = "image/png"
            image.output_encoding = images.PNG
        image.width = width
        image.height = height
        image.put()
        
        self.redirect('/')

class GetImageHandler(webapp.RequestHandler):
    def get(self):

        #check login
        if not users.get_current_user():
            self.redirect(users.create_login_url('/'))
            
        user = users.get_current_user()
        query = db.GqlQuery("SELECT * FROM Image WHERE user = :1", user)
        image = query.get()
        if image:
            self.response.headers['Content-Type'] = str(image.content_type)
            self.response.out.write(image.data)
        else:
            self.error(404)
            return

class ProcessImageHandler(webapp.RequestHandler):
    def post(self):

        #check login
        if not users.get_current_user():
            self.redirect(users.create_login_url('/'))

        user = users.get_current_user()
        query = db.GqlQuery("SELECT * FROM Image WHERE user = :1", user)
        saved_image = query.get()
        
        action = self.request.get("action")
        
        if saved_image and action:
            
            if action == "resize":            
                width = self.request.get("width")
                height = self.request.get("height")
                if width and height:
                    img = images.resize(saved_image.data, int(width), int(height), saved_image.output_encoding)
            elif action == "rotate":
                degrees = self.request.get("degrees")
                if degrees:
                    img = images.rotate(saved_image.data, int(degrees), saved_image.output_encoding)
            elif action == "im_feeling_lucky":
                img = images.im_feeling_lucky(saved_image.data, saved_image.output_encoding)
            elif action == "crop":
                left_x = self.request.get("left_x")
                top_y = self.request.get("top_y")
                right_x = self.request.get("right_x")
                bottom_y = self.request.get("bottom_y")
                if left_x and top_y and right_x and bottom_y:
                    img = images.crop(saved_image.data, float(left_x), float(top_y), float(right_x), float(bottom_y), saved_image.output_encoding)
                
            if img:
                # save new settings
                output_encoding = saved_image.output_encoding
                content_type, width, height = getImageInfo(img)
                
                # delete previous entity
                for image in query:
                    db.delete(image)
                
                image = Image()
                image.user = user
                image.data = db.Blob(img)
                image.output_encoding = output_encoding
                image.content_type = content_type
                image.width = width
                image.height = height
                image.put()
                
class SaveImageHandler(webapp.RequestHandler):
    def get(self):
    
        #check login
        if not users.get_current_user():
            self.redirect(users.create_login_url('/'))
            
        user = users.get_current_user()
        query = db.GqlQuery("SELECT * FROM Image WHERE user = :1", user)
        image = query.get()
        if image:
            self.response.headers['Content-Disposition'] = str("attachment; filename=edited_" + str(image.width) + "x" + str(image.height) + "." +  image.content_type.split("/")[1])
            self.response.headers['Content-Type'] = str(image.content_type)
            self.response.out.write(image.data)                


# START HERE
def main():
    application = webapp.WSGIApplication([
        ('/', MainHandler),
        ('/uploadImage', UploadHandler),
        ('/getImage', GetImageHandler),
        ('/processImage', ProcessImageHandler),
        ('/saveImage', SaveImageHandler)
    ], debug=True)
    wsgiref.handlers.CGIHandler().run(application)

if __name__ == '__main__':
    main()
