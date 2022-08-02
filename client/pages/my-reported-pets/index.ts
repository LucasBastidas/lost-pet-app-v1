import { Router } from "@vaadin/router";
import { state } from "../../state";
import "../../state";
class MyReportedPets extends HTMLElement {
	connectedCallback() {
		this.render();
	}
	addListeners() {
		const mensaje = this.querySelector(".msj");
		const button = this.querySelector(".button");

		//TE MUESTRA LAS MASCOTAS QUE REPORTADAS (POSTEADAS)
		state.getMyReportPets(() => {
			if (state.data.myPets[0] != undefined) {
				(mensaje as any).style.display = "none";
				(button as any).style.display = "none";

				// console.log(" hay mascotas");
			} else {
				// console.log("no hay mascotas");
				(mensaje as any).style.display = "block";
				(button as any).style.display = "block";
			}
		});
		button.addEventListener("click", () => {
			Router.go("/report-pet");
		});
	}
	render() {
		const style = document.createElement("style");
		style.innerHTML = `
      .gral-cont{
		display:flex;
		flex-direction:column;
		align-items:center
      }
	  .msj{
		display:block;
		color:red;
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
		<div class="gral-cont">
      <div class="text-cont">
      <h2>Mis mascotas reportadas </h2>    
		<p class="msj">Aun no hiciste ninguna publicación</p>
		<button class="button">Reportar una mascota</button>
		</div>
		<x-my-pet-cards-list></x-my-pet-cards-list>   
		</div>

      `;
		this.appendChild(style);
		this.addListeners();
	}
}
customElements.define("x-my-reported-pets-page", MyReportedPets);
