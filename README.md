# Systems Development and Frameworks - 2020/21

This is the repository of SCP-Foundation for the course `Systems Development and Frameworks`
at `Hochschule für Technik und Wirtschaft` in Berlin.

<p align="center">
  <img src="https://bloody-disgusting.com/wp-content/uploads/2019/11/SCP-Ccard-Wiki-01-e1573928853815.png" alt="homework" width="50%">
<p>

## How to use

You need NodeJS, NPM, VueJS installed on your computer. To run the application, clone the repository.

### Webapp

1. Navigate to `./webapp/`.
2. Run `npm install`.
3. Run `npm run dev` to start the application server for development.
4. Open `localhost:3000` in your web browser to view the application.
5. For deployment and execution run `npm run build && npm run start` (both commands can alternatively be run seperately).

### Backend

Why GraphCMS?
 - GraphCMS is a headless CMS where you can store and get data from
 - You don't need to set up a database
 - Your data is hosted without the need of a self-hosted server
 - The hosting is free (:

1. Navigate to `./backend/`.
2. (This course only !) Decrypt the `.env` file with `git-crypt-key` provided by the mentors.
3. Create a `.env`file
4. Add a JWT Secret similar to this `JWT_SECRET = Your_Secret`
5. Add a GRAPH_CMS_API_TOKEN that is provided by GraphCMS similar to this `GRAPH_CMS_API_TOKEN = Your_Token`
6. Add a GRAPH_CMS_ENDPOINT that is provided by GraphCMS similar to this `GRAPH_CMS_ENDPOINT = Your_Endpoint_Url`
7. Save the `.env`file
8. Run `npm install`.
9. Run `npm run dev` to start the application server.
10. Open `localhost:4000` in your web browser to view the application.

## Contributors

[Aimtracker](https://github.com/Aimtracker)

[Sboui431](https://github.com/Sboui431)

[MatzeK105](https://github.com/MatzeK105)
