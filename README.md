# fsjsProject11
## Build REST API with Express

## Project Description

In this project, you’ll create a REST API using Express. The API will provide a way for users to review educational courses: users can see a list of courses in a database; add courses to the database; and add reviews for a specific course.

To complete this project, you’ll use your knowledge of REST API design, Node.js, and Express to create API routes, along with Mongoose and MongoDB for data modeling, validation, and persistence.

The project entails the following steps:

1. Set up a database connection.
2. Create your Mongoose schema and models. Your database schema should match the following requirements:
    * User
    * Course
    * Review
3. Seed your database with data.
4. Create the user routes
5. Create the course routes
6. Update any POST and PUT routes to return Mongoose validation errors.
7. Update the User model to store the user's password as a hashed value.
8. Create an authentication method on the user model to return the user document based on their credentials
9.  Set up permissions to require users to be signed in
## Extra Credit

To get an "exceeds" rating, you can expand on the project in the following ways:

1. Review model - Validation added to prevent a user from reviewing their own course
2. User routes
    * Tests have been written for the following user stories:
        * When I make a request to the GET /api/users route with the correct credentials, the corresponding user document is returned
        * When I make a request to the GET /api/users route with the invalid credentials, a 401 status error is returned
3. Course routes
    * When returning a single course for the GET /api/courses/:courseId route, use Mongoose deep population to return only the fullName of the related user on the course model and each review returned with the course model. Example user object returned:
         { "_id": "wiubfh3eiu23rh89hcwib", "fullName": "Sam Smith" }