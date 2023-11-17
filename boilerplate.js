
/*//Code to reset or delete the database.
localforage.dropInstance({
    name: "localforage",
    storeName: "keyvaluepairs"
  }).then(function() {
    console.log("Database cleared!");
  }).catch(function(err) {
    console.log("Error clearing database:", err);
  });*/

  async function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
   }

// Boilerplate: initialize the db
class DB {
  db = null;
  config = {
    locateFile: (filename) =>
      "https://cdn.jsdelivr.net/npm/sql.js@1.8.0/dist/sql-wasm.wasm",
  };
  constructor() {
    return (async () => {
      this.#getLocalStorageData();
      // Call async functions here
      await sleep(500);
      return this;
      })();
    
  }

  #getLocalStorageData() {
    initSqlJs(this.config).then((SQL) => {
      localforage
        .getItem("db")
        .then((value) => {
          this.#initDB(value, SQL);
        })
        .catch(function (err) {
          console.log("Error: " + err);
        });
    });
  }

  #initDB(value, SQL) {
    if (value) {
      // if db exists, load it
      this.db = new SQL.Database(value);
    } else {
      // if db doesn't exist, create it
      console.log("Creating db");
      this.db = new SQL.Database();
      // Run a query without reading the results(login and response table)
      this.db.run("CREATE TABLE response (id INTEGER PRIMARY KEY, name TEXT, fruit TEXT);");
    }
  }

  #storeIndexDB() {
    localforage.setItem("db", this.db.export()).catch(function (err) {
      if (err) console.log(err);
    });
  }

   // function to create a table into the database.
   create(createQuery) {
    this.db.run(createQuery);
    this.#storeIndexDB();
  }
  // function to insert the data into the database.
  insert(insertQuery, values) {
    this.db.run(insertQuery, values);
    this.#storeIndexDB();
  }

  // function to update the data in the database.
  update(updateQuery, values) {
    this.db.run(updateQuery, values);
    this.#storeIndexDB();
  }

  // function to delete the data from the database.
  delete(deleteQuery, values) {
    this.db.run(deleteQuery, values);
    this.#storeIndexDB();
  }

  // function to select the data from the database.
  select(selectQuery, values) {
    return this.db.exec(selectQuery, values);
  }

  // function to select all the data from the database.
  selectAll(selectQuery) {
    return this.db.exec(selectQuery);
  }

}

 


