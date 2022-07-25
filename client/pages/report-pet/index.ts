import { Router } from "@vaadin/router";
import { state } from "../../state";
import { Dropzone } from "dropzone";

import { a, initMap, mapboxClient } from "./mapbox.js";
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
		const formButton = this.querySelector(".button");
		const cancelButton = this.querySelector(".cancel");
		const text = this.querySelector("#data-dz-size");
		const fotoInput = this.querySelector(".foto-input");

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
		initMap(map);
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
				const lng = latAndLng[0];
				const lat = latAndLng[1];
				// console.log(petName, description, lat, lng);

				state.setPostPetData(
					petName,
					description,
					urlImage[0],
					lat,
					lng,
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
      .cancel{
         cursor: pointer;
         text-decoration: underline;
      }
      `;
		this.innerHTML = `
      <script src="//api.mapbox.com/mapbox-gl-js/v2.3.1/mapbox-gl.js"></script>
      <script src="//unpkg.com/mapbox@1.0.0-beta9/dist/mapbox-sdk.min.js"></script>
  
      <link href="//api.mapbox.com/mapbox-gl-js/v2.3.1/mapbox-gl.css" rel="stylesheet" />
      <header-element></header-element>
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
               <input class="input" name="qmap" type="text">

               <div id="map" class="map"></div>
               </label>

               <div>
               <button class="button">Reportar como perdido</button>
               </div>

               <p class="cancel">Cancelar</p>

            </form>
         </div>
      </div>
      
      `;
		this.appendChild(style);
		this.addListeners();
	}
}
customElements.define("x-report-pet-page", ReportPet);
