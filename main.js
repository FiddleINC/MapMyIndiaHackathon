var homeLat, homeLong, map;

if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(showPosition);
}

function showPosition(position) {
    homeLat = position.coords.latitude;
    homeLong = position.coords.longitude;
    map = new MapmyIndia.Map("map", { center: [homeLat, homeLong], zoomControl: true, hybrid: true });
    L.marker([homeLat, homeLong]).addTo(map);
}

function create_content(title, content, ETA) {
    var h = new Array();
    h.push("<div>");
    h.push("<div class=\"info_css\">");
    h.push("<span>");
    h.push(title);
    h.push("</span> ");
    h.push("</div>");
    h.push("<div class=\"info_css\">");
    h.push(content);
    h.push("</div>");
    h.push("<div class=\"info_css\">");
    h.push(ETA);
    h.push("</div>");
    h.push("</div>");
    return h.join("");
    x
};

function addMarker(position, capacity, occupancy, eta) {
    // position must be instance of L.LatLng that replaces current WGS position of this object.
    var icon = L.icon({
        iconUrl: 'images' + '\\' + 'bus-512.png',
        iconRetinaUrl: 'images' + '\\' + 'bus-512.png',
        iconSize: [30, 30],
        popupAnchor: [-3, -15]
    });
    var mk = new L.Marker(position, { icon: icon });
    map.addLayer(mk);
    var content = create_content("Capacity : " + capacity.toString(), "Occupancy : " + occupancy.toString(), "ETA : " + eta.toString() + " min");
    mk.bindPopup(content);
    mk.on("mouseover", e => {
        mk.openPopup();
    })
    mk.on("click", function(e) {
        //your code about what you want to do on a marker click 
        openForm();
    });
    //return mk;
}

function showCircle() {
    lat = homeLat;
    lon = homeLong;
    radius = 1500;
    currentDiameter = L.circle([lat, lon], {
        color: 'pink',
        fillColor: '#FFC0CB',
        fillOpacity: 0.5,
        radius: radius
    });

    currentDiameter.addTo(map);
    map.fitBounds(currentDiameter.getBounds());

}

function calculateETA(position, capacity, occupancy) {
    var url = 'https://apis.mapmyindia.com/advancedmaps/v1/x4q9xaud535q4a4k15af5lf2af7uo4sx/distance_matrix_eta/driving/' + homeLong + ',' + homeLat + ';' + position[1] + ',' + position[0] + '?'
    axios.get(url)
        .then(response => {
            //return Math.round(response.data.results.durations[0][1] / 60)
            addMarker(position, capacity, occupancy, Math.round(response.data.results.durations[0][1] / 60));
        })
}

function showBuses() {
    showCircle();
    calculateETA([22.322562210218934, 87.31102016162874], 60, 40)
    calculateETA([22.321562210218934, 87.31902016162874], 100, 110);
    calculateETA([22.326562210218934, 87.30902016162874], 45, 40);
    calculateETA([22.323562210218934, 87.31602016162874], 50, 55);
}

function openForm() {
    document.getElementById("loginPopup").style.display = "block";
}

function closeForm() {
    document.getElementById("loginPopup").style.display = "none";
}
// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
    var modal = document.getElementById('loginPopup');
    if (event.target == modal) {
        closeForm();
    }
}

var x, i, j, selElmnt, a, b, c;
/* Look for any elements with the class "custom-select": */
x = document.getElementsByClassName("custom-select");
for (i = 0; i < x.length; i++) {
    selElmnt = x[i].getElementsByTagName("select")[0];
    /* For each element, create a new DIV that will act as the selected item: */
    a = document.createElement("DIV");
    a.setAttribute("class", "select-selected");
    a.innerHTML = selElmnt.options[selElmnt.selectedIndex].innerHTML;
    x[i].appendChild(a);
    /* For each element, create a new DIV that will contain the option list: */
    b = document.createElement("DIV");
    b.setAttribute("class", "select-items select-hide");
    for (j = 1; j < selElmnt.length; j++) {
        /* For each option in the original select element,
        create a new DIV that will act as an option item: */
        c = document.createElement("DIV");
        c.innerHTML = selElmnt.options[j].innerHTML;
        c.addEventListener("click", function(e) {
            /* When an item is clicked, update the original select box,
            and the selected item: */
            var y, i, k, s, h;
            s = this.parentNode.parentNode.getElementsByTagName("select")[0];
            h = this.parentNode.previousSibling;
            for (i = 0; i < s.length; i++) {
                if (s.options[i].innerHTML == this.innerHTML) {
                    s.selectedIndex = i;
                    h.innerHTML = this.innerHTML;
                    y = this.parentNode.getElementsByClassName("same-as-selected");
                    for (k = 0; k < y.length; k++) {
                        y[k].removeAttribute("class");
                    }
                    this.setAttribute("class", "same-as-selected");
                    break;
                }
            }
            h.click();
        });
        b.appendChild(c);
    }
    x[i].appendChild(b);
    a.addEventListener("click", function(e) {
        /* When the select box is clicked, close any other select boxes,
        and open/close the current select box: */
        e.stopPropagation();
        closeAllSelect(this);
        this.nextSibling.classList.toggle("select-hide");
        this.classList.toggle("select-arrow-active");
    });
}

function closeAllSelect(elmnt) {
    /* A function that will close all select boxes in the document,
    except the current select box: */
    var x, y, i, arrNo = [];
    x = document.getElementsByClassName("select-items");
    y = document.getElementsByClassName("select-selected");
    for (i = 0; i < y.length; i++) {
        if (elmnt == y[i]) {
            arrNo.push(i)
        } else {
            y[i].classList.remove("select-arrow-active");
        }
    }
    for (i = 0; i < x.length; i++) {
        if (arrNo.indexOf(i)) {
            x[i].classList.add("select-hide");
        }
    }
}

/* If the user clicks anywhere outside the select box,
then close all select boxes: */
document.addEventListener("click", closeAllSelect);