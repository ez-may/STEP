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

    private ArrayList<UserComment> allComments = new ArrayList<UserComment>();

    @Override
    public void doGet(HttpServletRequest request, HttpServletResponse response) throws IOException {
        
        if (allComments.size() == 0) {

            // If there are no comments, then we send an empty string so the FE
            // can handle it, otherwise we send the comments normally
            response.setContentType("text");
            response.getWriter().println("");

        } else {

            // Send the JSON as the response
            response.setContentType("application:json;");
            response.getWriter().println(convertCommentsToJson());
        }
    }

    /*
    * Takes all the comments which the servelet is currently storing and converts 
    * them to JSON, such that the final string should be of the form: 
    * "[{name: "userName1", comment: userCommnet1"}]"
    * Note that this implementation allows for the FE to convert this into a list of
    * strings in JSON format, and should more instance variables be included in a 
    * UserComment object this function should not be affected.
    */
    private String convertCommentsToJson() {
        
        // gson object to access conversion functions
        Gson gson = new Gson();

        // Holds all the JSON objects in an arraylist which can later be converted
        ArrayList<String> jsonComments = new ArrayList<String>();

        // Goes through each usercomment object and converts it to JSON.
        // JSON objects are then added to the arraylist  
        for (UserComment uc : allComments) {
            
            // Creates a new reference for each tempstring as it loops through
            String tempString = new String();
            tempString = gson.toJson(uc);

            jsonComments.add(tempString);
        }

        // Converts and returns the arraylist of json objects as a json string
        return gson.toJson(jsonComments);
    }

    @Override
    public void doPost(HttpServletRequest request, HttpServletResponse response) throws IOException {
        
        // Processes the user comment
        String name = request.getParameter("name");
        String text = request.getParameter("user-comment");

        // Converts the values into a new UserComment object and adds it to the list
        UserComment newComment = new UserComment(name, text);
        allComments.add(0, newComment);

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

}
