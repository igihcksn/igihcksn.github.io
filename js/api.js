var base_url = "https://api.football-data.org/v2/";
var api_key = "52cfa1f68e0145c1ac301bd4a0e36a92";

// Blok kode yang akan di panggil jika fetch berhasil
function status(response) {
  if (response.status !== 200) {
    console.log("Error : " + response.status);
    // Method reject() akan membuat blok catch terpanggil
    return Promise.reject(new Error(response.statusText));
  } else {
    // Mengubah suatu objek menjadi Promise agar bisa "di-then-kan"
    return Promise.resolve(response);
  }
}

// Blok kode untuk memparsing json menjadi array JavaScript
function json(response) {
  return response.json();
}

// Blok kode untuk meng-handle kesalahan di blok catch
function error(error) {
  // Parameter error berasal dari Promise.reject()
  console.log("Error : " + error);
}

// Blok kode untuk melakukan request data json
function getArticles() {
  if ("caches" in window) {
    caches.match(base_url + "competitions/2001/teams").then(function(response) {
      if (response) {
        response.json().then(function(data) {
          var teamsHTML = "";
            data.teams.forEach(function(teams) {
              var url = teams.crestUrl;
              if (url != null) {
                url.replace(/http:\/\//i, 'https://');
              }
              teamsHTML += `
                  <tr>
                    <td><a href="teams.html?id=${teams.id}">${teams.shortName}</a></td>
                    <td>${teams.area['name']}</td>
                    <td><img src="${url}" width="50"></img></td>
                  </tr>
              `;
            });

            var dataHTML = `
                  <h2>${data.competition['name']}</h2>
                  <table class="responsive-table striped">
                    <thead>
                      <tr>
                          <th>Team Name</th>
                          <th>Area Name</th>
                          <th>Flag Team</th>
                      </tr>
                    </thead>
              
                    <tbody id="tbody-competitions">
                    ${teamsHTML}
                    </tbody>
                  </table>
            `;
            // Sisipkan komponen card ke dalam elemen dengan id #content
            document.getElementById("table-competition").innerHTML = dataHTML;
        });
      }
    });
  }

  fetch(base_url + "competitions/2001/teams", {
    headers: {
        'X-Auth-Token': api_key
    }
})
    .then(status)
    .then(json)
    .then(function(data) {
      // Menyusun komponen card artikel secara dinamis
      var teamsHTML = "";
      data.teams.forEach(function(teams) {
        var url = teams.crestUrl;
        if (url != null) {
          url.replace(/http:\/\//i, 'https://');
        }
        teamsHTML += `
            <tr>
              <td><a href="teams.html?id=${teams.id}">${teams.shortName}</a></td>
              <td>${teams.area['name']}</td>
              <td><img src="${url}" width="50"></img></td>
            </tr>
        `;
      });

      var dataHTML = `
            <h2>${data.competition['name']}</h2>
            <table class="responsive-table striped">
              <thead>
                <tr>
                    <th>Team Name</th>
                    <th>Area Name</th>
                    <th>Flag Team</th>
                </tr>
              </thead>
        
              <tbody id="tbody-competitions">
              ${teamsHTML}
              </tbody>
            </table>
      `;
      // Sisipkan komponen card ke dalam elemen dengan id #content
      document.getElementById("table-competition").innerHTML = dataHTML;
    })
    .catch(error);
}

function getArticleById() {
  return new Promise(function(resolve, reject) {
    // Ambil nilai query parameter (?id=)
    var urlParams = new URLSearchParams(window.location.search);
    var idParam = urlParams.get("id");

    if ("caches" in window) {
      caches.match(base_url + "teams/" + idParam).then(function(response) {
        if (response) {
          response.json().then(function(data) {
              var squads = '';
              data.squad.forEach((squad) => {
                squads +=`
                  <tr>
                    <td>${squad.name}</td>
                    <td>${squad.position}</td>
                    <td>${squad.nationality}</td>
                    <td>${squad.shirtNumber}</td>
                  </tr>
                `
              })

              var articleHTML = `
                <div class="card">
                  <div class="card-image waves-effect waves-block waves-light">
                    <img src="${data.crestUrl}" />
                  </div>
                  <div class="card-content">
                    <span class="card-title" id="title-card">${data.name}(${data.shortName})</span>
                      <div class="row">
                        <form class="col s12">
                          <div class="row">
                            <div class="input-field col s6">
                              <i class="material-icons prefix">location_on</i>
                              <input id="icon_prefix" type="text" class="validate" value="${data.venue}" disabled>
                            </div>
                            <div class="input-field col s6">
                              <i class="material-icons prefix">phone</i>
                              <input id="icon_telephone" type="tel" class="validate" value="${data.phone}" disabled>
                            </div>
                            <div class="input-field col s12">
                              <textarea id="textarea1" class="materialize-textarea">${data.address}</textarea>
                              <label for="textarea1">Address</label>
                            </div>
                          </div>
                        </form>
                      </div>
                      <h4>List Teams</h4>
                      <table>
                        <thead>
                          <tr>
                              <th>Nama</th>
                              <th>Posisi</th>
                              <th>Negara Asal</th>
                              <th>Nomer Punggung</th>
                          </tr>
                        </thead>

                        <tbody>
                          ${squads}  
                        </tbody>
                      </table>
                  </div>
                </div>
              `;
              // Sisipkan komponen card ke dalam elemen dengan id #content
              document.getElementById("body-content").innerHTML = articleHTML;
              // Kirim objek data hasil parsing json agar bisa disimpan ke indexed db
              resolve(data);
          });
        }
      });
    }

    fetch(base_url + "teams/" + idParam, {
      headers: {
          'X-Auth-Token': api_key
      }
  })
      .then(status)
      .then(json)
      .then(function(data) {
        // Objek JavaScript dari response.json() masuk lewat variabel data.
        // console.log(data);
        // Menyusun komponen card artikel secara dinamis
        var squads = '';
        data.squad.forEach((squad) => {
          squads +=`
            <tr>
              <td>${squad.name}</td>
              <td>${squad.position}</td>
              <td>${squad.nationality}</td>
              <td>${squad.shirtNumber}</td>
            </tr>
          `
        })

        var articleHTML = `
          <div class="card">
            <div class="card-image waves-effect waves-block waves-light">
              <img src="${data.crestUrl}" />
            </div>
            <div class="card-content">
              <span class="card-title" id="title-card">${data.name}(${data.shortName})</span>
                <div class="row">
                  <form class="col s12">
                    <div class="row">
                      <div class="input-field col s6">
                        <i class="material-icons prefix">location_on</i>
                        <input id="icon_prefix" type="text" class="validate" value="${data.venue}" disabled>
                      </div>
                      <div class="input-field col s6">
                        <i class="material-icons prefix">phone</i>
                        <input id="icon_telephone" type="tel" class="validate" value="${data.phone}" disabled>
                      </div>
                      <div class="input-field col s12">
                        <textarea id="textarea1" class="materialize-textarea">${data.address}</textarea>
                        <label for="textarea1">Address</label>
                      </div>
                    </div>
                  </form>
                </div>
                <h4>List Teams</h4>
                <table>
                  <thead>
                    <tr>
                        <th>Nama</th>
                        <th>Posisi</th>
                        <th>Negara Asal</th>
                        <th>Nomer Punggung</th>
                    </tr>
                  </thead>

                  <tbody>
                    ${squads}  
                  </tbody>
                </table>
            </div>
          </div>
        `;
        // Sisipkan komponen card ke dalam elemen dengan id #content
        document.getElementById("body-content").innerHTML = articleHTML;
        // Kirim objek data hasil parsing json agar bisa disimpan ke indexed db
        resolve(data);
      });
  });
}

function getSavedTeam() {
  getAll().then(function(teams) {
    // Menyusun komponen card artikel secara dinamis
    var teamsHTML = "";
    teams.forEach(function(teams) {
      // var description = article.post_content.substring(0, 100);
      teamsHTML += `
            <div class="card">
              <div class="card-image">
                <img src="${teams.crestUrl}">
                <a href="teams.html?id=${teams.id}&saved=true">
                  <span class="card-title" style="color:#333;background:#fff;width:100%"><b>${teams.name}.(${teams.shortName})</b></span>
                </a>
                <a class="btn-floating halfway-fab waves-effect waves-light red" onclick="deleteById('${teams.id}')"><i class="material-icons" id="delete">delete</i></a>
              </div>
              <div class="card-content">
                <p>I am a very simple card. I am good at containing small bits of information. I am convenient because I require little markup to use effectively.</p>
              </div>
            </div>
        `;
    });
    // Sisipkan komponen card ke dalam elemen dengan id #content
    document.getElementById("favorite-team").innerHTML = teamsHTML;
  });
}