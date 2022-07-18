import { state } from "../../state";
export function initNearbyPetCard() {
	class NearbyPetCardCompEl extends HTMLElement {
		petId;
		userId;
		petName;
		constructor() {
			super();
			this.petId = this.getAttribute("petId");
			this.userId = this.getAttribute("userId");
			this.petName = this.getAttribute("title");
		}
		connectedCallback() {
			this.render();
		}
		addListeners() {
			const cardCont = this.querySelector(".card-cont");
			const lost = this.getAttribute("lost");
			const encontrado = this.querySelector(".encontrado");
			const reportButton = this.querySelector(".report-button");

			//BOTON PARA REPORTAR INFORMACION
			reportButton.addEventListener("click", () => {
				this.dispatchEvent(
					new CustomEvent("report", {
						detail: {
							petId: this.petId,
							userId: this.userId,
							petName: this.petName,
						},
						bubbles: true,
						// esto hace que el evento pueda
						// ser escuchado desde un elemento
						// que está más "arriba" en el arbol
					})
				);
			});
			if (lost === "true") {
				(cardCont as any).style["border-color"] = "red";
				(cardCont as any).style["background-color"] = "#7a0000de";
			} else {
				(encontrado as any).style.display = "block";
				(cardCont as any).style["border-color"] = "green";
				(cardCont as any).style["background-color"] = "#084508d1";
				(reportButton as any).style.display = "none";
			}
		}
		render() {
			const border = this.querySelector(".card-cont");
			const lost = this.getAttribute("lost");
			const title = this.getAttribute("title");
			const description = this.getAttribute("description");
			const imageUrl = this.getAttribute("imageUrl");
			const petId = this.getAttribute("pet-id");
			var style = document.createElement("style");
			style.innerHTML = `
            .card-cont{
               display:flex;
               flex-direction:column;
               align-items:center;
               text-align: inherit;
               padding-bottom:5px;
               height:400px;
               width:320px;
               border: 5px solid ;
               border-radius: 5%;
               background-color: #313131;
               color: white;
               box-shadow: 5px 5px 25px 3px #000, 5px 5px 10px 1px #000;
            }
            .image-cont{
               width:307px;
               height:200px
            }
            .image{
               border-radius: 7px 7px 0px 0px;
               width:307px;
               height:200px
            }
            .title-description-cont{
               text-align: center;
               padding-left:8px;
               padding-right:8px;
            }
            .title{               
               font-size: 22px;
               color: whitesmoke;
               margin: 0px;
               padding-top:10px;
            }
            .description{
               font-size: 18px;
               margin-bottom: 8px;
            }
            .vermas{
               font-size:20px;
               color: #607d8b;
            }
            .urls-cont{
               display: flex;
               gap:25px;
            }
            .report-button{
               background-color: #79cae4a8;
               border: none;
               font-size: 15px;
               border-radius: 3px;
               width: 200px;
               height: 40px;
               font-weight: 700;
            }
            .encontrado{
               display:none;
               font-size:22px;
               color:lime
            }
         `;

			this.innerHTML = `
         <div class="card-cont">
         <div class="image-cont">
         <img src="${imageUrl}" class="image"></img>
         </div>
         <div class="title-description-cont">
            <h3 class="title">${title}</h3>
            <p class="description">${description}</p>
         </div>
         <div>
         <button class="report-button">Reportar información</button>
         </div>
         <div>
         <p class="encontrado">ENCONTRADO!</p>
         
      </div>
         `;
			this.appendChild(style);
			this.addListeners();
		}
	}
	customElements.define("x-nearby-pet-card", NearbyPetCardCompEl);
}
