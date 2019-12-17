var dbPromised = idb.open("football-champions", 1, function(upgradeDb) {
  var teamsObjectStore = upgradeDb.createObjectStore("team", {
    keyPath: "id"
  });
  teamsObjectStore.createIndex("team_name","team_name",{
    uniquer: false
  })
});

function saveTeam(team) {
  dbPromised
    .then(function(db) {
      var tx = db.transaction("team", "readwrite");
      var store = tx.objectStore("team");
      store.put(team);
      return tx.complete;
    })
    .then(function() {
      console.log("Team berhasil di simpan.");
    });
}

function getAll() {
  return new Promise(function(resolve, reject) {
    dbPromised
      .then(function(db) {
        var tx = db.transaction("team", "readonly");
        var store = tx.objectStore("team");
        return store.getAll();
      })
      .then(function(team) {
        resolve(team);
      });
  });
}

function getAllByTitle(name) {
  dbPromised
    .then(function(db) {
      var tx = db.transaction("team", "readonly");
      var store = tx.objectStore("team");
      var titleIndex = store.index("team_name");
      var range = IDBKeyRange.bound(name, name + "\uffff");
      return titleIndex.getAll(range);
    })
    .then(function(team) {
      console.log(team);
    });
}

function getById(id) {
  return new Promise(function(resolve, reject) {
    dbPromised
      .then(function(db) {
        var tx = db.transaction("team", "readonly");
        var store = tx.objectStore("team");
        return store.get(id);
      })
      .then(function(team) {
        resolve(team);
      });
  });
}

function deleteById(id) {
  dbPromised
    .then(function (db) {
        var tx = db.transaction('team', 'readwrite');
        var store = tx.objectStore('team');
        store.delete(parseInt(id));
        return tx.complete;
      })
      .then(function(team) {
        M.toast({html: 'Team favorite anda berhasil dihapus!'})
        location.reload();
      })
}
