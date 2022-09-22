import { Router } from "@vaadin/router";
import { state } from "../../state";
import "../../state";
class Home extends HTMLElement {
	connectedCallback() {
		this.render();
	}
	addListeners() {
		const button = this.querySelector(".button");
		const text = this.querySelector(".text-cont");
		const textNotFound = this.querySelector(".not-found");

		//SI YA ESTA MI UBICACIÓN EN EL STATE, EL BOTON "DAR UBICACIÓN" NO APARECE
		if (state.data.myLat != "") {
			(text as any).style.display = "none";
			state.data.nearbyPets = [];
			state.searchNearbyPets(() => {
				if (state.data.nearbyPets.length === 0) {
					textNotFound.textContent = "NO HAY MASCOTAS CERCANAS PARA MOSTRAR";
				} else {
					textNotFound.textContent =
						"ESTAS MASCOTAS ESTAN CERCA DE TU UBICACION";
				}
			});
		}

		//BOTON PARA DAR UBICACIÓN/
		button.addEventListener("click", () => {
			state.setMyLoc(() => {
				state.data.nearbyPets = [];
				state.searchNearbyPets(() => {
					if (state.data.nearbyPets.length === 0) {
						textNotFound.textContent = "NO HAY MASCOTAS CERCANAS PARA MOSTRAR";
					} else {
						textNotFound.textContent =
							"ESTAS MASCOTAS ESTAN CERCA DE TU UBICACION";
					}
				});
			});
			(text as any).style.display = "none";
		});
	}
	render() {
		const style = document.createElement("style");
		style.innerHTML = `
      .home-cont{
			flex-direction: column;
    		align-items: center;
    		display: flex;
			text-align:center;
      }
		.not-found{
			text-align:center;
			font-size:25px;
		}
		.button{
			width: 300px;
			height: 75px;
			font-size: 20px;
			font-weight: 600;
			border: none;
			background-color: burlywood;
			border-radius: 70px;
			cursor:pointer;
		}
      `;
		this.innerHTML = `
      <header-element></header-element>
		<div class="home-cont">
      <div class="text-cont">
      <h1>Para ver las mascotas perdidas cercanas, necesitamos tu ubicación </h1>
      <button class="button">Dar mi ubicación</button>
      </div>
      <h2 class = "not-found"></h2>
      <div class="cards-cont">
      <x-nearby-pet-cards-list></x-nearby-pet-cards-list>
      </div>
		<div>
      
      `;
		this.appendChild(style);
		this.addListeners();
	}
}
customElements.define("x-home-page", Home);
