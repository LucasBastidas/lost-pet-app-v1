import { state } from "../../state";
import { Route, Router } from "@vaadin/router";
import { getModeForUsageLocation } from "typescript";
export function initHeaderComp() {
	class HeaderCompEl extends HTMLElement {
		constructor() {
			super();
			this.render();
		}
		addlisteners() {
			const logo = this.querySelector(".logo");
			const abrir = this.querySelector(".open-menu");
			const cerrar = this.querySelector(".close-menu");
			const menu = this.querySelector(".menu");
			const myEmail = this.querySelector(".my-email");
			const logOutButton = this.querySelector(".log-out-button");
			const logInButton = this.querySelector(".log-in-button");
			const myData = this.querySelector(".mis-datos");
			const myLostPets = this.querySelector(".mascotas-reportadas");
			const reportPet = this.querySelector(".reportar-pet");

			//Determina si el boton LogOut y el email se ve o no
			if (state.data.logged === 1) {
				(logOutButton as any).style.display = "block";
				(myEmail as any).style.display = "block";
				(logInButton as any).style.display = "none";
			} else {
				(logOutButton as any).style.display = "none";
				(myEmail as any).style.display = "none";
				(logInButton as any).style.display = "block";
			}

			//BOTON LOGIN
			logInButton.addEventListener("click", () => {
				Router.go("/log-in-1");
			});
			//IR A LA HOME PRESIONANDO EL LOGO
			logo.addEventListener("click", () => {
				state.data.nearbyPets = [];
				Router.go("/");
			});
			//ABRIR MENU
			abrir.addEventListener("click", () => {
				(menu as any).style.animation = "myAnim 1s ease 0s 1 normal forwards";
				(menu as any).style.display = "flex";
			});
			//CERRAR MENU
			cerrar.addEventListener("click", () => {
				(menu as any).style.animation = "myAnim2 1s ease 0s 1 normal forwards";
				setTimeout(function () {
					(menu as any).style.display = "none";
				}, 900);
			});

			//CERRAR SESIÓN
			logOutButton.addEventListener("click", () => {
				state.resetState(() => {
					Router.go("/");
					(logOutButton as any).style.display = "none";
					(myEmail as any).style.display = "none";
					(logInButton as any).style.display = "block";
				});
			});

			//IR A MIS DATOS
			myData.addEventListener("click", () => {
				// console.log("antes de set path");

				state.setPathMenu("myData", () => {
					// console.log("soy setpath");

					if (state.data.logged === 1) {
						// console.log("estas Logeado");
						Router.go("/my-data");
						(menu as any).style.display = "none";
					} else {
						// console.log("no estas logeado");
						Router.go("/log-in-1");
						(menu as any).style.display = "none";
					}
				});
			});

			//IR A MIS MASCOTAS REPORTADAS (POSTEADAS)
			myLostPets.addEventListener("click", () => {
				// console.log("antes de set path");

				state.setPathMenu("myReports", () => {
					// console.log("soy setpath");

					if (state.data.logged === 1) {
						// console.log("estas Logeado");
						state.getMyReportPets(() => {
							Router.go("/my-reported-pets");
							(menu as any).style.display = "none";
						});
					} else {
						// console.log("no estas logeado");
						Router.go("/log-in-1");
						(menu as any).style.display = "none";
					}
				});
			});

			//IR A REPORTAR UNA MASCOTA (POSTEAR)
			reportPet.addEventListener("click", () => {
				// console.log("antes de set path");

				state.setPathMenu("reportPet", () => {
					// console.log("soy setpath");

					if (state.data.logged === 1) {
						// console.log("estas Logeado");
						Router.go("/report-pet");
						(menu as any).style.display = "none";
					} else {
						// console.log("no estas logeado");
						Router.go("/log-in-1");
						(menu as any).style.display = "none";
					}
				});
			});
		}
		render() {
			var style = document.createElement("style");
			style.innerHTML = `

         .cont{
            display: flex;
            justify-content: space-between;
            background-color: #172d4a;
            height: 90px;
            color: #CEC9C9;         
         }

         .logo{
            height: 90px;
            width: 90px;
         }
		 .open-menu-button-cont{
			display:flex;
			align-items:center;
			padding-right: 5px;

		 }
         .menu{
            display: none;
            flex-direction:column;
            position: absolute;
            margin-left: auto;
            margin-right: auto;
            gap:100px;
            left: 0;
            right: 0;
            text-align: center;
            background-color:black;
            animation: myAnim 1s ease 0s 1 normal forwards;
            height:100vh;
			font-family: "Poppins"; 
         }
         .open-menu{
			width: 40px;
            cursor:pointer;
			height: 45px;
         }
         .close-menu{
            position: fixed;
            right: 50px;
            cursor:pointer;
			font-size:20px;
         }
         @keyframes myAnim {
            0% {
               opacity: 0;
               transform: rotateX(70deg);
               transform-origin: top;
            }
         
            100% {
               opacity: 1;
               transform: rotateX(0deg);
               transform-origin: top;
            }
         }
         @keyframes myAnim2 {
            0% {
               opacity: 1;
               transform: rotateX(0deg);
               transform-origin: top;
            }
         
            100% {
               opacity: 0;
               transform: rotateX(70deg);
               transform-origin: top;
            }
         }

        .button-menu{
          cursor:pointer;
        }
        .iniciar-sesion{
          display:block;
        }
         
         `;
			this.innerHTML = `
         <div class="cont">
         <div><img class="logo" src="https://cdn-icons-png.flaticon.com/512/489/489399.png" alt="hola"></img></div>
         <div class="open-menu-button-cont">
         <img class="open-menu" src="https://cdn-icons-png.flaticon.com/512/1828/1828726.png"></img>
         </div>
         <div class="menu">
         <div class="close-menu"> X </div>
            <p class="mis-datos button-menu">Mis Datos</p>
		          <p class="mascotas-reportadas button-menu">Mis mascotas reportadas</p>
			        <p class="reportar-pet button-menu">Reportar Mascota</p>
		 <div class="sesion-buttons-cont">
     <p class="my-email button-menu">${
				state.data.myEmail || "No estas logeadx"
			}</p>
     <p class="log-out-button button-menu">Cerrar sesión</p>
     <p class="log-in-button button-menu">Iniciar sesión</p>
			
		<div>	
         <div>
         </div>
         `;
			this.appendChild(style);
			this.addlisteners();
		}
	}
	customElements.define("header-element", HeaderCompEl);
}
