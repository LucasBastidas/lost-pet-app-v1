import { Router } from "@vaadin/router";
import { state } from "../../state";
import "../../state";
class SignUp extends HTMLElement {
	connectedCallback() {
		this.render();
	}
	addListeners() {
		const form = this.querySelector(".form");
		const error = this.querySelector(".error");
		form.addEventListener("submit", (e) => {
			e.preventDefault();
			const target = e.target as any;
			const name = target.name.value;
			const password1 = target.password1.value;
			const password2 = target.password2.value;

			//PARA REGISTRARSE HAY QUE PONER DOS VECES LA NUEVA CONTRASEÑA
			if (password1 === password2) {
				(error as any).style.display = "none";
				// console.log("contraseñas iguales, puedes seguir");

				state.setMyNameForRegister(name, () => {
					state.signUp(password1, () => {
						// console.log("me registre");
						state.getToken(password1, () => {
							// console.log("YA TENGO TOKEN");
							state.setLogged(() => {
								// console.log("Y estoy logeado");
								if (state.data.go === "myData") {
									Router.go("/my-data");
								} else if (state.data.go === "myReports") {
									Router.go("/my-reported-pets");
								} else if (state.data.go === "reporPet") {
									Router.go("/report-pet");
								} else {
									Router.go("/");
								}
							});
						});
					});
				});
			} else {
				(error as any).style.display = "block";
				// console.log("contraseñas distintas, error");
			}
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
	  }
		.error{
			display:none;
			color:red;
		}
      `;
		this.innerHTML = `
      <header-element></header-element>
      
			<div class="form-cont">
      <h2>REGISTRATE</h2>
				<form class="form">
				<label>
				<p>Tu nombre</p>
					<div>
						<input class="input" name="name" type="text">
					</div>
				</label>

				<label>
				<p>Contraseña</p>
					<div>
					<input class="input" name="password1" type="password">
					</div>
				</label>

				<label>
				<p>Repetir contraseña</p>
					<div>
					<input class="input" name="password2" type="password">
					</div>
				</label>

					<div>
						<button class="button">Siguiente</button>
					</div>	
				</form>
				<p class="error">LAS CONTRASEÑAS NO COINCIDEN</p>
			</div>

      
      `;
		this.appendChild(style);
		this.addListeners();
	}
}
customElements.define("x-sign-up-page", SignUp);
