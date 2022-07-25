import { state } from "../../state";
export function initNearbyPetCardsList() {
	class NearbyPetCardsListCompEl extends HTMLElement {
		connectedCallback() {
			state.subscribe(() => {
				this.render();
			});
			this.render();
		}
		addListeners() {
			const formCont = this.querySelector(".form-cont");
			const form = this.querySelector(".form");
			const formButton = this.querySelector(".form-button");
			const closeButton = this.querySelector(".cerrar");

			this.querySelector(".list").addEventListener("report", (e) => {
				// console.log((e as any).detail);
				const petId = (e as any).detail.petId;
				const userId = (e as any).detail.userId;
				const petName = (e as any).detail.petName;
				// const pets = state.data.nearbyPets;
				// pets.map((pet) => {
				// 	console.log(pet);
				// });

				//SE GUARDAN LOS DATOS DEL USUARIO QUE POSTEÓ PARA PODER ENVIARLE UN REPORTE
				state.setReportPetData(userId, petId, petName, () => {
					(formCont as any).style.display = "flex";
					// console.log(state.data);
					state.setReportPetEmail(() => {
						// console.log("tengo el email del dueño de la mascota");
					});
				});
			});

			//SE ENVIA UN EMAIL CON LA INFORMACIÓN AL "DUEÑO" DE LA MASCOTA
			form.addEventListener("submit", (e) => {
				e.preventDefault();
				// console.log("funcionando");
				const target = e.target as any;
				const name = target.name.value;
				const tel = target.tel.value;
				const message = target.description.value;
				// console.log({ name, tel, message });
				if (name != "" && tel != "" && message != "") {
					state.setMyNameTelAndMessage(name, tel, message, () => {
						state.sendReportPetEmail(() => {
							// console.log("email enviado");
						});
					});
				} else {
					alert("COMPLETA TODOS LOS CAMPOS");
				}
			});
			formButton.addEventListener("click", () => {
				(formCont as any).style.display = "none";
			});
			closeButton.addEventListener("click", () => {
				(formCont as any).style.display = "none";
			});
		}
		render() {
			const style = document.createElement("style");
			style.innerHTML = `
         .list{
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 40px;
         }
			.form-cont{
				display: none;
				flex-direction: column;
				position: fixed;
				margin-left: 20px;
				margin-right: 20px;
				background-color: #6f95b3;
				border: solid;
				border-color: #3774a5;
				border-radius: 4%;
				top: 20%;
				gap: 100px;
				left: 0;
				right: 0;
				text-align: center;
				animation: myAnim 1s ease 0s 1 normal forwards;
			}
			.input{
				font-size:20px;
				height:30px;
				width:260px;
			}
			.text-area{
				font-size:20px;
				width:260px;
			}
			.form-button{
				width: 260px;
				margin-bottom: 15px;
				border: none;
				border-radius: 25px;
				background-color: burlywood
			}
			.cerrar{
				font-size: 25px;
				position: fixed;
				right: 24px;
				cursor: pointer;
				font-weight: 700;
         }
      `;
			const pets = state.data.nearbyPets;
			this.innerHTML = `
         <div class="list">
         
            ${pets
							.map(
								(pet) =>
									`<x-nearby-pet-card title="${pet.name}" imageUrl= "${
										pet.imageUrl
									}" description="${
										pet.description || "Sin descripción"
									}" petId="${pet.objectID}" userId="${pet.user_id}" lost="${
										pet.lost || "true"
									}"  ></x-nearby-pet-card>`
							)
							.join("")}
      </div>
		<div class="form-cont">
		<div class="cerrar"> X </div>
		<form class="form">
			<label>
				<p>Tu Nombre</p>
				<input class="input" type="text" name="name">
			</label>

			<label>
				<p>Tu telefono</p>
				<input class="input" type="text" name="tel">
			</label>

			<label>
				<p>Mensaje</p>
				<textarea name="description" cols="30" rows="10"></textarea>
			</label>
			<div>
			<button class="form-button">ENVIAR</button>
			</div>
		</form>
		</div>
      `;
			this.appendChild(style);
			this.addListeners();
		}
	}
	customElements.define("x-nearby-pet-cards-list", NearbyPetCardsListCompEl);
}
