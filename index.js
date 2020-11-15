const express = require("express");
const app = express();
const pool = require("./db");
const axios = require("axios");
const bodyParser = require("body-parser");

app.use(
    bodyParser.urlencoded({
        extended: false
    })
);
app.use(bodyParser.json());

app.use(function (req, res, next) {
    console.log(req.body);
    next();
})

// create a repo
app.post("/github", async (req, res) => {
    try {
        axios.get(req.body.url,
            {
                headers: { "Content-Type": "application/json" }
            })
            .then(repoRes => {
                let repos = repoRes.data;
                repos.map(async (repo) => {
                    let repoIsPresent = await pool.query("SELECT * FROM repos where id=$1", [repo.id]);
                    console.log(repoIsPresent.rows);
                    // console.log(repo);
                    if (!repoIsPresent.rows.length) {
                        await pool.query("INSERT INTO repos (id, name, html_url, description, created_at, open_issues, watchers, owner) VALUES ($1,$2,$3,$4,$5,$6,$7,$8)",
                            [
                                repo.id,
                                repo.name,
                                repo.html_url,
                                repo.description,
                                repo.created_at,
                                repo.open_issues,
                                repo.watchers,
                                JSON.stringify(repo.owner),
                            ])
                    }
                })
                return res.status(200).json({
                    success: true
                })
            })
            .catch(err => {
                console.log(err)
            })
    } catch (err) {
        console.log(err);
    }
})

// get a repo
app.get("/github/:id", async (req, res) => {
    try {
        const { id } = req.params;
        let repoIsPresent = await pool.query("SELECT * FROM repos where id=$1", [id]);
        if (repoIsPresent.rows[0]) {
            let repo = repoIsPresent.rows[0];
            repo.owner = JSON.parse(repo.owner);
            return res.status(200).json({
                success: true,
                repo
            })
        } else {
            return res.status(404).json({
                success: false,
                message: "repo not found"
            })
        }


    } catch (e) {

    }
})

app.listen(5000, () => {
    console.log("server is listening on port 5000");
})