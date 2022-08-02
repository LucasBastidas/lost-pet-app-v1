import { Router } from "@vaadin/router";
import { state } from "../../state";
import "../../state";
class LogIn2 extends HTMLElement {
	connectedCallback() {
		this.render();
	}
	addListeners() {
		const error = this.querySelector(".error");
		const form = this.querySelector(".form");
		const forgottenPasswordButton = this.querySelector(".recover-password");

		//BOTON QUE ENVIA EL PASSWORD POR EMAIL
		forgottenPasswordButton.addEventListener("click", () => {
			state.recoverPassword(() => {
				if (state.data.recoverPasswordCheck == 0) {
					(error as any).textContent = "Email no registrado.";
					(error as any).style.color = "red";
					(error as any).style.display = "block";
				} else if (state.data.recoverPasswordCheck == 1) {
					(error as any).textContent =
						"Se te envió un email con tu nueva contraseña";
					(error as any).style.color = "green";
					(error as any).style.display = "block";
				}
			});
		});
		//SE INGRESA LA CONTRASEÑA
		form.addEventListener("submit", (e) => {
			e.preventDefault();
			const target = e.target as any;
			const password = target.password.value;
			state.setHashedPassword(password, () => {
				state.getToken(password, () => {
					//SI ES INCORRECTA SE MOSTRARÁ UN CARTEL
					if (state.data.token === undefined) {
						(error as any).style.display = "block";
					}
					//SI ES CORRECTA TE LOGEA Y TE ENVÍA A DONDE HABIAS SELECCIONADO ANTES
					else {
						(error as any).style.display = "none";
						state.getMyName(password, () => {
							console.log(state.data.myName);
							// console.log("contraseña correcta");
							state.setLogged(() => {
								if (state.data.go === "myData") {
									Router.go("/my-data");
								} else if (state.data.go === "myReports") {
									state.getMyReportPets(() => {
										// console.log("ya tengo mis pets");
										Router.go("/my-reported-pets");
									});
								} else if (state.data.go === "reportPet") {
									Router.go("/report-pet");
								} else {
									Router.go("/");
								}
							});
						});
					}
				});
			});
		});
	}
	render() {
		const style = document.createElement("style");
		style.innerHTML = `
  
	  .form-cont{
		display: flex;
		flex-direction: column;
		align-items: center;
		text-align: center;
      }
	  .title{
		font-size:35px;
	  }
	  .input{
		width: 250px;
    	font-size: 20px;
	  }
	  .button{
		width: 250px;
		margin-top: 30px;
		border: none;
		height: 30px;
		border-radius: 25px;
		background-color: aquamarine;
		cursor:pointer;
	  }
		.error{
			display:none;
		}
    .recover-password{
      cursor: pointer;
      text-decoration: underline;
      color:blue;
    }
      `;
		this.innerHTML = `
      <header-element></header-element>
      
			<div class="form-cont">
			<h2 class="title">INGRESA TU CONTRASEÑA</h2>
				<form class="form">
					<input class="input" name="password" type="password">
					<div>
						<button class="button">Siguiente</button>
					</div>
				</form>
        <p class="recover-password">Olvidé mi contraseña</p>
        <p class="error">Contraseña incorrecta</p>
			</div>


      
      `;
		this.appendChild(style);
		this.addListeners();
	}
}
customElements.define("x-log-in-2-page", LogIn2);
