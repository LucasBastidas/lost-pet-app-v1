import { Router } from "@vaadin/router";
import { state } from "../../state";
import "../../state";
class taskCompleted extends HTMLElement {
	connectedCallback() {
		this.render();
	}
	addListeners() {
		const button = this.querySelector(".button");
		button.addEventListener("click", () => {
			Router.go("/");
		});
	}
	render() {
		const style = document.createElement("style");
		style.innerHTML = `
      .task-completed-cont{
		display: flex;
		flex-direction: column;
		align-items: center;
		border: ridge;
		margin: 20px;
		padding-bottom: 20px;
      }

		.button{
			width: 300px;
			height: 75px;
			font-size: 20px;
			font-weight: 600;
			border: none;
			background-color: burlywood;
			border-radius: 70px;
		}
      `;
		this.innerHTML = `
      <header-element></header-element>
		<div class="task-completed-cont">
      <h1>${state.data.completedMessage}</h1>
		<div>
		<button class="button">Volver a la Home</button>
      
      `;
		this.appendChild(style);
		this.addListeners();
	}
}
customElements.define("x-task-completed-page", taskCompleted);
