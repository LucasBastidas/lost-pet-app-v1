import { Router } from "@vaadin/router";
import { state } from "../../state";
import { Dropzone } from "dropzone";

import { mapboxGl, initMap, mapboxClient } from "./mapbox.js";
import "../../state";
class ReportPet extends HTMLElement {
	connectedCallback() {
		this.render();
	}

	addListeners() {
		const urlImage = [];
		const latAndLng = [];
		const map = this.querySelector("#map");
		map as any;
		const formButton = this.querySelector(".report-pet-button");
		const cancelButton = this.querySelector(".cancel");
		const text = this.querySelector("#data-dz-size");
		const fotoInput = this.querySelector(".foto-input");
		const mapboxButton = this.querySelector(".mapbox-button");
		const mapboxInput = this.querySelector("#mapbox-input");
		var mapBoxUbication = "";

		//DROPZONE PARA SUBIR UNA IMAGEN
		const myDropzone = new Dropzone(fotoInput, {
			url: "/falsa",
			autoProcessQueue: false,
		});

		const dropzone = myDropzone.on("thumbnail", function (file) {
			const dataUrl = file.dataURL;
			// console.log(dataUrl);
			urlImage[0] = dataUrl;
			return dataUrl;
		});
		// MAPBOX
		const mapboxMap = initMap(map);
		async function searchLatAndLng(lugar) {
			const search = await mapboxClient.geocodeForward(lugar, {
				// country: "ar",
				autocomplete: true,
				language: "es",
			});
			const result = search.entity.features[0];
			const [lng, lat] = result.center;
			latAndLng[0] = lng;
			latAndLng[1] = lat;
			return [lng, lat];
		}

		mapboxButton.addEventListener("click", () => {
			// console.log("holas")
			console.log(mapboxInput);
			console.log(mapboxInput.textContent);
			console.log((mapboxInput as any).value);
			mapBoxUbication = (mapboxInput as any).value;
			mapboxClient.geocodeForward(
				(mapboxInput as any).value,
				{
					autocomplete: true,
					language: "es",
				},
				function (err, data, res) {
					console.log(data.features[0].geometry.coordinates);
					mapboxMap.setCenter(data.features[0].geometry.coordinates);
					mapboxMap.setZoom(12);
					if (!err) data.features;
				}
			);
		});
		//FORM
		const form = this.querySelector(".form");
		form.addEventListener("submit", async (e) => {
			e.preventDefault();
			const target = e.target as any;
			if (
				target.petName.value == "" ||
				target.petDescription.value == "" ||
				urlImage[0] == undefined
			) {
				alert("Completa todos los campos!");
			} else {
				// console.log(urlImage[0]);

				(formButton as any).textContent = "Creando post";
				const lngAndLat = await searchLatAndLng(target.qmap.value);
				const petName = target.petName.value;
				const description = target.petDescription.value;
				const ubication = target.qmap.value;
				const lng = latAndLng[0];
				const lat = latAndLng[1];
				// console.log(petName, description, lat, lng);

				state.setPostPetData(
					petName,
					description,
					urlImage[0],
					lat,
					lng,
					ubication,
					() => {
						// console.log(state.getState());
						state.postNewReport(() => {
							// console.log(lat, lng);

							state.getMyReportPets(() => {
								Router.go("/my-reported-pets");
							});
						});
					}
				);
				// console.log(dropzone);
			}
		});
		cancelButton.addEventListener("click", () => {
			Router.go("/");
		});
	}
	render() {
		const style = document.createElement("style");
		style.innerHTML = `
      .gral-cont{
         display: flex;
         justify-content: center;
         flex-direction: column;
         align-items: center;
      }
      .form-cont{
         width: 300px;
      }
      .title{
         display:block;
      }
      .foto-input{
         width: 100%;
         height: 140px;
         background-color: rgba(171, 163, 153, 0.606);
      }
      img{
         width: 100%;
         height: 140px;
      }
      .dz-details{
         display:none;
      }
      .dz-progress{
         display:none;
      }
      .dz-error-message{
         display:none;
      }
      .dz-success-mark{
         display:none;
      }
      .dz-progress{
         display:none;
      }
      .dz-error-mark{
         display:none;
      }
      .form{
         display:flex;
         flex-direction: column;
         gap:15px;
      }
      .input{
         height:25px;
         width:100%;
      }
      .text-area{
         height:150px;
         width:100%;
      }
      .map{
         height:150px;
         width:100%;
      }
      .mapbox-form{
         display:flex;
         margin-bottom: 16px;
         gap: 5px;
      }
      .mapbox-button{
         appearance: auto;
         writing-mode: horizontal-tb !important;
         display: flex;
         height: 25px;
         align-items: center;
         border: solid 2px;
         border-radius: 5px;
         text-align: center;        
         cursor: pointer;
         background-color: buttonface;
         margin: 0em;
         padding: 1px 6px;
         border-width: 2px;
         border-style: outset;
         border-color: buttonborder;
         border-image: initial;     
      }
      .buttons-cont{
         display: flex;
         flex-direction: column;
         align-items: center;
      }
      .report-pet-button{
         width: 250px;
      margin-top: 30px;
      border: none;
      height: 30px;
      border-radius: 25px;
      background-color: aquamarine;
      cursor: pointer;
      }
      .cancel{
         cursor: pointer;
         text-decoration: underline;
      }
      `;
		this.innerHTML = `
      <header-element></header-element>
      <script src="//api.mapbox.com/mapbox-gl-js/v2.3.1/mapbox-gl.js"></script>
      <script src="//unpkg.com/mapbox@1.0.0-beta9/dist/mapbox-sdk.min.js"></script>
      
      <link href="//api.mapbox.com/mapbox-gl-js/v2.3.1/mapbox-gl.css" rel="stylesheet" />
      <div class="gral-cont">
      <h2 class="title">Reportar mascota perdida.</h2>
      <div class="form-cont">
      <form class="form">
      
      <label>
                  <p>Nombre</p>
                  <input class="input" name="petName" type="text">
               </label>
                  <div>
               <p class="image-text">Arrastrá tu imagen o apreta acá ⬇⬇</p>
               <div style=background-color:gray" class="foto-input"></div>
                  </div>

               <label>
               <p>Descripción</p>
               <textarea class="text-area" name="petDescription"></textarea>
               </label>

               <label>
               <p>UBICACIÓN (Punto de referencia)</p>
               <div class="mapbox-form">
               <input class="input" name="qmap" type="text" id="mapbox-input">
               <p class="mapbox-button">🌎</p>
               </div>
               <div id="map" class="map"></div>
               </label>

               <div class="buttons-cont">

               <div>
               <button class="report-pet-button">Reportar como perdido</button>
               </div>

               <p class="cancel">Cancelar</p>
               </div>

            </form>
         </div>
      </div>
      
      `;
		this.appendChild(style);
		this.addListeners();
	}
}
customElements.define("x-report-pet-page", ReportPet);
