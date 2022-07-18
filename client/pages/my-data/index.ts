import { Router } from "@vaadin/router";
import { state } from "../../state";
import "../../state";
class MyData extends HTMLElement {
	connectedCallback() {
		this.render();
	}
	addListeners() {
		const error = this.querySelector(".error");
		const form = this.querySelector(".form");
		const ok = this.querySelector(".ok");

		error as any;
		//ACÁ SE PUEDEN CAMBIAR ALGUNOS DE NUESTROS DATOS Y LA CONTRASEÑA
		form.addEventListener("submit", (e) => {
			e.preventDefault();
			const target = e.target as any;
			const newName = target.name.value;
			const newPassword1 = target.password1.value;
			const newPassword2 = target.password2.value;
			if (newName != "" && newPassword1 != "") {
				//PARA CAMBIAR LA CONTRASEÑA HAY QUE INGRESAR LA NUEVA DOS VECES
				if (newPassword1 === newPassword2) {
					// console.log("se cambia nombre y password");
					state.updatePassword(newPassword1, () => {
						state.getToken(newPassword1, () => {
							// console.log("NUEVO TOKEN, CONTRASEÑA CAMBIADA");
							state.updateName(newName, () => {
								state.setMyNameForRegister(newName, () => {
									// console.log("el name fue actualizado");
									(ok as any).style.display = "block";
									(error as any).style.display = "none";
								});
							});
						});
					});
				} else {
					// console.log("las contraseñas no son iguales");
					(error as any).style.display = "block";
					(ok as any).style.display = "none";
				}
			} else if (newName != "" && newPassword1 == "" && newPassword2 == "") {
				// console.log("se cambia solo el nombre");
				state.updateName(newName, () => {
					state.setMyNameForRegister(newName, () => {
						// console.log("el name fue actualizado");
						(error as any).style.display = "none";
						(ok as any).style.display = "block";
					});
				});
			} else if (newName == "" && newPassword1 != "") {
				if (newPassword1 === newPassword2) {
					// console.log("se cambia solo password");
					state.updatePassword(newPassword1, () => {
						state.getToken(newPassword1, () => {
							// console.log("NUEVO TOKEN, CONTRASEÑA CAMBIADA");
							(error as any).style.display = "none";
							(ok as any).style.display = "block";
						});
					});
				} else {
					// console.log("las contraseñas no son iguales");
					(error as any).style.display = "block";
					(ok as any).style.display = "none";
				}
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
	}
	.error{
		display:none;
		color:red;
	}
	.ok{
		display:none;
		color:green;
	}
	.button{
		width: 171px;
		margin-top: 20px;
		border: none;
		height: 30px;
		background-color: aquamarine;
    border-radius: 25px;
	}
      `;
		this.innerHTML = `
      <header-element></header-element>
		<div class="form-cont">
      			<h2>MIS DATOS</h2>
				<form class="form">
         <label>
         <p class="label-title">Nombre</p>
				<input name="name" type="text">
         </label>

			<p class="label-title">Contraseña</p>
				<input name="password1" type="password">
			</label>

			<p class="label-title">Repetir contraseña</p>
				<input name="password2" type="password">
			</label>
					<div>
						<button class="button">Guardar</button>
					</div>
				</form>
				<p class="error">Las contraseñas no coinciden</p>
				<p class="ok">DATOS GUARDADOS</p>
			</div>

      
      `;
		this.appendChild(style);
		this.addListeners();
	}
}
customElements.define("x-my-data-page", MyData);
