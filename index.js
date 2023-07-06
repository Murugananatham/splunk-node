const express = require("express");
let splunkjs = require('splunk-sdk');

const app = express();

app.listen(3001, () => console.log("Server listening at port 3001"));

// This middleware will not allow the
// request to go beyond it
app.use(function (req, res, next) {
    console.log("Middleware called")
    // Add headers before the routes are defined
    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', '*');

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);

    next();
});


app.get("/", (req, res) => {
    res.send("Hello World");
});

app.get("/check", (req, res) => {
    res.send("Are you checking something???");
});

app.get("/splunk-login", (req, res) => {
    // Create a Service instance and log in 
    let service = new splunkjs.Service({
        username: "admin",
        password: "Pa55word",
        scheme: "https",
        host: "localhost",
        port: "8089"
    });

    // Print installed apps to the console to verify login
    try {
        // First, we log in
        var splunkLogin = async () => {
            try {
                await service.login();
            } catch (err) {
                console.log("err", err)
                console.log("Error in logging in");
                res.send({ error: err, mesage: "Error in logging in" })
                return;
            }
            // Now that we're logged in, let's get a listing of all the apps.
            let apps = await service.apps().fetch();
            let appList = apps.list();
            console.log("Applications:");
            var AppsArray = []
            for (let i = 0; i < appList.length; i++) {
                let app = appList[i];
                console.log("  App " + i + ": " + app.name);
                AppsArray.push(app.name)
            }
            res.send({ "AppsList": AppsArray })
            return;
        }
        splunkLogin()
    } catch (err) {
        console.log("There was an error retrieving the list of applications:", err);
        res.send({ error: err, mesage: "There was an error retrieving the list of applications" })
        return;
    }
    // res.send("Are you checking something???");
});



app.get("/splunk-sample-search", (req, res) => {
    let service = new splunkjs.Service({
        username: "admin",
        password: "Pa55word",
        scheme: "https",
        host: "localhost",
        port: "8089"
    });

    // Search everything and return the first 100 results
    let searchQuery = "| tstats count where index=_internal by sourcetype";

    // Set the search parameters
    let searchParams = {
        exec_mode: "blocking",
        earliest_time: "2023-07-01T00:00:00.000+05:30"
    };

    // A blocking search returns the job's SID when the search is done
    console.log("Wait for the search to finish...");

    var SplunkResultsObject = {}

    try {

        var splunkSearch = async () => {

            // Run a blocking search and get back a job
            let job = await service.search(searchQuery, searchParams);
            console.log("...done!\n");

            // Get the job from the server to display more info
            job = await job.fetch();
            // Display properties of the job
            console.log("Search job properties\n---------------------");
            console.log("Search job ID:         " + job.sid);
            console.log("The number of events:  " + job.properties().eventCount);
            console.log("The number of results: " + job.properties().resultCount);
            console.log("Search duration:       " + job.properties().runDuration + " seconds");
            console.log("This job expires in:   " + job.properties().ttl + " seconds");

            // Get the results and display them
            let results;
            [results, job] = await job.results({ count: 10 });
            let fields = results.fields;
            let rows = results.rows;
            for (let i = 0; i < rows.length; i++) {
                let values = rows[i];
                console.log("Row " + i + ": ");
                for (let j = 0; j < values.length; j++) {
                    let field = fields[j];
                    let value = values[j];
                    console.log("  " + field + ": " + value);
                }
            }
            SplunkResultsObject["fields"] = fields
            SplunkResultsObject["rows"] = rows
            res.send(SplunkResultsObject)
            console.log("running the sample search is success, response sent to requester")
            return;
        }
        splunkSearch()
    } catch (err) {
        console.log("There was an error running the sample search:", err);
        res.send({ error: err, mesage: "There was an error running the sample search" })
        return;
    }
})


app.get("/splunk-sample-search", (req, res) => {
    let service = new splunkjs.Service({
        username: "admin",
        password: "Pa55word",
        scheme: "https",
        host: "localhost",
        port: "8089"
    });

    // Search everything and return the first 100 results
    let searchQuery = "| tstats count where index=_internal by sourcetype";

    // Set the search parameters
    let searchParams = {
        exec_mode: "blocking",
        earliest_time: "2023-07-01T00:00:00.000+05:30"
    };

    // A blocking search returns the job's SID when the search is done
    console.log("Wait for the search to finish...");

    var SplunkResultsObject = {}

    try {

        var splunkSearch = async () => {

            // Run a blocking search and get back a job
            let job = await service.search(searchQuery, searchParams);
            console.log("...done!\n");

            // Get the job from the server to display more info
            job = await job.fetch();
            // Display properties of the job
            console.log("Search job properties\n---------------------");
            console.log("Search job ID:         " + job.sid);
            console.log("The number of events:  " + job.properties().eventCount);
            console.log("The number of results: " + job.properties().resultCount);
            console.log("Search duration:       " + job.properties().runDuration + " seconds");
            console.log("This job expires in:   " + job.properties().ttl + " seconds");

            // Get the results and display them
            let results;
            [results, job] = await job.results({ count: 10 });
            let fields = results.fields;
            let rows = results.rows;
            for (let i = 0; i < rows.length; i++) {
                let values = rows[i];
                console.log("Row " + i + ": ");
                for (let j = 0; j < values.length; j++) {
                    let field = fields[j];
                    let value = values[j];
                    console.log("  " + field + ": " + value);
                }
            }
            SplunkResultsObject["fields"] = fields
            SplunkResultsObject["rows"] = rows
            res.send(SplunkResultsObject)
            console.log("running the sample search is success, response sent to requester")
            return;
        }
        splunkSearch()
    } catch (err) {
        console.log("There was an error running the sample search:", err);
        res.send({ error: err, mesage: "There was an error running the sample search" })
        return;
    }
})