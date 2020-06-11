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
import com.google.appengine.api.datastore.Entity;
import com.google.appengine.api.datastore.PreparedQuery;
import com.google.appengine.api.datastore.Query;
import com.google.appengine.api.datastore.Query.SortDirection;
import com.google.gson.Gson;
import com.google.gson.Gson;
import java.util.Arrays;
import java.util.ArrayList;
import java.io.IOException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

/** Servlet that returns some example content. TODO: modify this file to handle comments data */
@WebServlet("/data")
public class DataServlet extends HttpServlet {

    @Override
    public void doGet(HttpServletRequest request, HttpServletResponse response) throws IOException {
        ArrayList<String> allComments = doCommentQuery();

        if (allComments.isEmpty()) {
            // If there are no comments, then we send an empty string so the FE
            // can handle it, otherwise we send the comments normally
            response.setContentType("text");
            response.getWriter().println("");
        } else {
            // Specifies the response as JSON and reads the response size
            response.setContentType("application:json;");
            String responseSize = request.getParameter("size");
            
            // sends the response depending on the amount of comments the user specified
            if (responseSize.equals("all") || Integer.parseInt(responseSize) > allComments.size()) {
                response.getWriter().println(convertToJson(allComments));
            } else {
                int responseSizeVal = Integer.parseInt(responseSize);
                response.getWriter().println(convertToJson(allComments.subList(0, responseSizeVal)));
            }
        }
    }

    /*
    * Converts an object into JSON using Gson, but abstracts the need to make a Gson object in 
    * different parts of code.
    */
    private String convertToJson(Object target) {
        Gson gson = new Gson();
        return gson.toJson(target);
    }

    /**
    * Makes a query to the datastore for user comment data, creates UserComment objects from that data,
    * converts the objects to JSON using Gson for ease of implementation, and returns an array list
    * of type string with the data.
    */
    private ArrayList<String> doCommentQuery() {
        Query query = new Query("Comment").addSort("timestamp", SortDirection.DESCENDING);

        DatastoreService datastore = DatastoreServiceFactory.getDatastoreService();
        PreparedQuery results = datastore.prepare(query);

        // temporary array list to return from this method
        ArrayList<String> tempList = new ArrayList<String>();

        // Iterates over the comments data, uses them to create new UserCommennt objetcs, and adds them
        // to the list
        for (Entity comment : results.asIterable()) {
            long timestamp = (long) comment.getProperty("timestamp");
            String name = (String) comment.getProperty("name");
            String text = (String) comment.getProperty("text");

            UserComment tempComment = new UserComment(name, text);

            tempList.add(convertToJson(tempComment));
        }

        // returns the templist with the datastore comments
        return tempList;
    }

    @Override
    public void doPost(HttpServletRequest request, HttpServletResponse response) throws IOException {
        
        // Processes the user comment and adds the timestamp
        String name = request.getParameter("name").trim();
        String text = request.getParameter("user-comment").trim();
        Long timestamp = System.currentTimeMillis();

        // Creates the comment entity and adds the data to it
        Entity newComment = new Entity("Comment");
        newComment.setProperty("name", name);
        newComment.setProperty("text", text);
        newComment.setProperty("timestamp", timestamp);

        DatastoreService datastore = DatastoreServiceFactory.getDatastoreService();
        datastore.put(newComment);

        // Redirect back to main page
        response.sendRedirect("/#comments");

    }

    /**
    * User comment class which allows for the easy grouping of information related
    * to a comment. Because of the implementation of GSON, having all the information
    * related to a comment in a single object allows it to easily be converted to JSON
    * later and will make FE parsing easier.
    **/
    private class UserComment {

        public String userName;
        public String userComment;

        public UserComment(String name, String text) {
            userName = name;
            userComment = text;
        }

    }

    /*
    * Simple Implementation to reduce need to type print statements in debugging.
    */
    private void SOP(Object thing) {
        System.out.println(thing);
    }

}
