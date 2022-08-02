import { Router } from "@vaadin/router";
import { state } from "../../state";
import "../../state";
class LogIn1 extends HTMLElement {
	connectedCallback() {
		this.render();
	}
	addListeners() {
		const form = this.querySelector(".form");
		//SE INGRESA UN EMAIL
		form.addEventListener("submit", (e) => {
			e.preventDefault();
			const target = e.target as any;
			if (target.email.value === "") {
				alert("INGRESA UN EMAIL");
			} else {
				state.setMyEmail(target.email.value, () => {
					state.checkUserEmail(() => {
						//SI NO ESTA REGISTRADO TE LLEVA A REGISTRARTE
						if (state.data.register === 0) {
							// console.log("No estas registrado, pasa a registrarte");
							Router.go("/sign-up");
							//SI ESTA REGISTRADO TE LLEVA A LOGEARTE
						} else if (state.data.register === 1) {
							// console.log("Estas registrado, pasa a logearte con tu pass");
							Router.go("./log-in-2");
						}
					});
				});
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
		cursor:pointer;
	  }
      `;
		this.innerHTML = `
      <header-element></header-element>
      
			<div class="form-cont">
        <h2 class="tilte">INGRESA TU EMAIL</h2>
				<form class="form">
					<input class="input" name="email" type="email">
					<div>
						<button class="button">Siguiente</button>
					</div>
				</form>
			</div>

      
      `;
		this.appendChild(style);
		this.addListeners();
	}
}
customElements.define("x-log-in-1-page", LogIn1);
