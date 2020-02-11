var senadores = data.results[0].members;
var estadisticas = {
  democratas: [],
  republicanos: [],
  independentistas: [],
  votoPorDem: 0,
  votoPorRep: 0,
  votoPorInd: 0,
  totalsenadores: 0,
  menosleales: [],
  masleales: [],
  masatten: [],
  menosatten: []
};
// OBTENER CANTIDADES DE PARTIDO
function getparty(array, party) {
  var senador = array.filter(senador => {
    if (senador.party == party) {
      return senador;
    }
  });
  return senador;
}
estadisticas.democratas = getparty(senadores, "D");
estadisticas.republicanos = getparty(senadores, "R");
estadisticas.independentistas = getparty(senadores, "I");

console.log(estadisticas.democratas);
console.log(estadisticas.republicanos);
console.log(estadisticas.independentistas);

// OBTENER PORCENTAJES PARTIDO

function porcentajepartido(partido) {
  var porcent = 0;
  for (let i = 0; i < partido.length; i++) {
    if (partido[i].votes_with_party_pct) {
      porcent += partido[i].votes_with_party_pct || 0;
    }
  }
  return porcent / partido.length;
}

estadisticas.votoPorDem = parseFloat(porcentajepartido(estadisticas.democratas).toFixed(2));
estadisticas.votoPorRep = parseFloat(porcentajepartido(estadisticas.republicanos).toFixed(2));
estadisticas.votoPorInd = parseFloat(porcentajepartido(estadisticas.independentistas).toFixed(2));

function esnulo(v) {
  if (isNaN(v)) {
    return 0;
  } else {
    return v;
  }
}
estadisticas.votoPorInd = esnulo(estadisticas.votoPorInd);

console.log(estadisticas.votoPorDem);
console.log(estadisticas.votoPorRep);
console.log(estadisticas.votoPorInd);
console.log(estadisticas.totalsenadores);

if (estadisticas.votoPorInd == 0) {
  estadisticas.totalsenadores = (
    (parseFloat(estadisticas.votoPorDem) + parseFloat(estadisticas.votoPorRep)) /
    2
  ).toFixed(2);
} else {
  estadisticas.totalsenadores = (
    (parseFloat(estadisticas.votoPorDem) +
      parseFloat(estadisticas.votoPorRep) +
      parseFloat(estadisticas.votoPorInd)) /
    3
  ).toFixed(2);
}

console.log(estadisticas.totalsenadores);
// Cargas tabla-data

if (page == "datas") {
  var senadorData = data.results[0].members;
  var paracargarhtml = senadorData.map(function(pepito) {
    var fullname = "";
    if (pepito.middle_name == null) {
      fullname = pepito.last_name + " " + pepito.first_name;
    } else {
      fullname = pepito.last_name + " " + pepito.first_name + " " + pepito.middle_name;
    }
    return (
      "<tr><td><a href=" +
      pepito.url +
      ">" +
      fullname +
      "</a><td>" +
      pepito.party +
      "</td>" +
      "<td>" +
      pepito.state +
      "</td>" +
      "<td>" +
      pepito.seniority +
      "</td>" +
      "<td>" +
      pepito.votes_with_party_pct +
      "%" +
      "</td>" +
      "</td></tr>"
    );
  });
  var mitabla = document.getElementById("datas");
  mitabla.innerHTML = paracargarhtml.join("");
}

// ORDENAR
function sortJSON(array, key, orden) {
  return array.sort(function(a, b) {
    var x = a[key],
      y = b[key];
    if (orden === "asc") {
      return x < y ? -1 : x > y ? 1 : 0;
    }
    if (orden === "desc") {
      return x > y ? -1 : x < y ? 1 : 0;
    }
  });
}

function porcent10(array) {
  var nums = [];
  var porcent = (array.length * 10) / 100;
  Math.trunc(porcent);
  for (var i = 0; i <= porcent - 1; i++) {
    nums[i] = array[i];
  }
  return nums;
}
var orden, porcents, porcentaje;
orden = sortJSON(senadores, "votes_with_party_pct", "asc");
porcents = porcent10(orden);
estadisticas.menosleales = porcents;
orden = sortJSON(senadores, "votes_with_party_pct", "desc");
porcents = porcent10(orden);
estadisticas.masleales = porcents;

orden = sortJSON(senadores, "missed_votes_pct", "desc");
porcents = porcent10(orden);
estadisticas.menosatten = porcents;
orden = sortJSON(senadores, "missed_votes_pct", "asc");
porcentaje = porcent10(orden);
estadisticas.masatten = porcentaje;

console.log(estadisticas.masleales);
console.log(estadisticas.menosleales);
console.log(estadisticas.masatten);
console.log(estadisticas.menosatten);

// CARGAR EN TABLA
if (page == "loyalty" || "attendance") {
  function paracargar(idtd, valor) {
    if (document.getElementById(idtd) != null) {
      document.getElementById(idtd).innerHTML = valor;
    }
  }
  paracargar("repR", estadisticas.republicanos.length);
  paracargar("porcVotR", estadisticas.votoPorRep);
  paracargar("repD", estadisticas.democratas.length);
  paracargar("porcVotD", estadisticas.votoPorDem);
  paracargar("repI", estadisticas.independentistas.length);
  paracargar("porcVotI", estadisticas.votoPorInd);
  paracargar("totalrep", senadores.length);
  paracargar("totalporc", estadisticas.totalsenadores);
}

//PARA CARGAR EN ATTENDANCE
if (page == "attendance") {
  function cargarAtten(tbodyid, item) {
    console.log(item);
    var fullname = "";

    var tohtml = item.map(politico => {
      if (politico.middle_name == null) {
        fullname = politico.last_name + " " + politico.first_name;
      } else {
        fullname = politico.last_name + " " + politico.first_name + " " + politico.middle_name;
      }
      return (
        "<tr><td><a href=" +
        politico.url +
        ">" +
        fullname +
        "</a><td>" +
        politico.total_votes +
        "</td>" +
        "<td>" +
        politico.missed_votes_pct +
        "%" +
        "</td>" +
        "</td></tr>"
      );
    });
    document.getElementById(tbodyid).innerHTML = tohtml.join("");
  }
  cargarAtten("menoscompro", estadisticas.menosatten);
  cargarAtten("mascompro", estadisticas.masatten);
}
// PARA CARGAR EN LOYALTY
if (page == "loyalty") {
  function cargarLoyal(tbodyid, item) {
    console.log(item);
    var fullname = "";

    var parahtml = item.map(politico => {
      if (politico.middle_name == null) {
        fullname = politico.last_name + " " + politico.first_name;
      } else {
        fullname = politico.last_name + " " + politico.first_name + " " + politico.middle_name;
      }
      return (
        "<tr><td><a href=" +
        politico.url +
        ">" +
        fullname +
        "</a><td>" +
        politico.total_votes +
        "</td>" +
        "<td>" +
        politico.votes_with_party_pct +
        "%" +
        "</td>" +
        "</td></tr>"
      );
    });
    document.getElementById(tbodyid).innerHTML = parahtml.join("");
  }
  cargarLoyal("menosleales", estadisticas.menosleales);
  cargarLoyal("masleales", estadisticas.masleales);
}
