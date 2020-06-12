// Copyright 2019 Google LLC
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     https://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

package com.google.sps.servlets;

import com.google.appengine.api.datastore.DatastoreService;
import com.google.appengine.api.datastore.DatastoreServiceFactory;
import com.google.appengine.api.datastore.Key;
import com.google.appengine.api.datastore.KeyFactory;
import java.io.IOException;
import java.util.Arrays;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

/** 
 * Servlet that deletes comment data based on the ids it receives.
 **/
@WebServlet("/delete-data")
public class DeleteDataServlet extends HttpServlet {

    @Override
    public void doPost(HttpServletRequest request, HttpServletResponse response) throws IOException {
        // Processes the comment ids into an array of long values
        String idList = request.getParameter("idList");
        String[] ids = idList.split(",");
        
        // deletes all the entities in data store with the ids
        for (int i = 0; i < ids.length; i++) {
            Long tempIdNum = Long.parseLong(ids[i]);
            Key commentKey = KeyFactory.createKey("Comment", tempIdNum);
            DatastoreService datastore = DatastoreServiceFactory.getDatastoreService();
            datastore.delete(commentKey);
        }
   }

    /**
     * Simple Implementation to reduce need to type print statements in debugging.
     **/
    private void SOP(Object thing) {
        System.out.println(thing);
    }

}
