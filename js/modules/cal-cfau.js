class calCFAU extends HTMLElement {
	constructor() {
		super();
		this.shadow = this.attachShadow({ mode: 'open' });

		/* Config */
		this.zone = "alsace-moselle";

		this.txtMois = [
			"Janvier",
			"Février",
			"Mars",
			"Avril",
			"Mai",
			"Juin",
			"Juillet",
			"Août",
			"Septembre",
			"Octobre",
			"Novembre",
			"Decembre"
		];

		this.txtJours = [
			"Dim",
			"Lun",
			"Mar",
			"Mer",
			"Jeu",
			"Ven",
			"Sam"
		];


		/* Année Scolaire courante */
		let d = new Date();
		if (d.getMonth() < 8) { // Septembre
			this.annee = d.getFullYear() - 1;
		} else {
			this.annee = d.getFullYear();
		}

		/* Style */
		this.shadow.innerHTML = `
            <style>
                :host {
                    display: block;
                    container-type: inline-size;
                }
				header {
					background: #000;
					color: #fff;
					font-size: 24px;
					padding: 4px 8px;
					margin: 4px 0;
				}
                nav {
                   	font-family: Arial;
                    display: flex;
                    gap: 4px;
                    margin-bottom: 4px;
                    container-type: inline-size;
                    container-name: module;
					.annee {
						font-size: 24px;
                    	font-weight: bold;
					}
					.entreprise{
						margin-left: auto;
					}
					.entreprise, .universite, .examens {
						display: flex;
						align-items: center;
						padding: 2px 4px;
					}
                }

                main {
                    display: grid;
                    grid-template-columns: repeat(12, 1fr);
                    gap: 1px;
                    background: #ddd;
                    padding: 1px;
                }

                @container (width < 1200px) {
                    main {
                        grid-template-columns: repeat(6, 1fr);
                    }
                }
                @container (width < 700px) {
                    main {
                        grid-template-columns: repeat(3, 1fr);
                    }
                }
                @container (width < 450px) {
                    main {
                        grid-template-columns: 1fr;
                    }
                }

                main>div {
                    background: #fff;
                }
                .jour {
                    display: grid;
                    grid-template-columns: 20px 50px 1fr 1fr;
                    cursor: pointer;
                    user-select: none;
                }
                .jour:has(.txtJour:hover), .matin:hover, .apresmidi:hover{
                    outline: 1px solid #777;
                    z-index: 1;
                }
				.jour svg {
					position: absolute;
					cursor: pointer;
				}
				.select {
					background: rgba(10, 204, 0, 0.2);
				}
				.paste, .jour:not(.select)>.semaine>.paste.active+.copy {
					pointer-events: none;
					opacity: 0;
				}
				.jour:not(.select)>.semaine>.paste.active {
					pointer-events: auto;
					opacity: 1;
				}
                .WE {
                    background: #aaa;
                    pointer-events: none;
                }
                .ferie {
                    background: #ccc;
                }
                .universite {
                    background: rgba(255, 251, 0, 1);
                }
                .entreprise {
                    background: rgba(0, 172, 230, 1);
					color: #fff;
                }
                .examens {
                    background: orange;
                }
				.semaine {
					color: red;
					cursor: auto;
				}

                footer {
                    display: flex;
                    justify-content: flex-end;
                    gap: 4px;
                    padding-top: 4px;
                }
				footer>.totaux {
					margin-right: auto;
				}
                button {
                    padding: 4px 16px;
                    border: none;
                    background: rgba(173, 0, 204, 1);
                    color: #fff;
                    cursor: pointer;
                }
                button:hover {
                    outline: 1px solid #777;
                }

				@media print {
					* {
						-webkit-print-color-adjust: exact;
						print-color-adjust: exact;
					}
					:host{
						zoom: 80%;
					}
					button {
						display: none;
					}
				}
                
            </style>`;
	
		// Gestion du print en dehors du custom element
		document.head.innerHTML += `
			<style>
				@page {
					size: landscape;
				}
				@media print {
					body *:not(calendrier-cfau) {
						display: none;
					}
				}
			</style>`;

		/* Affichage calendrier */
		this.shadow.innerHTML += `
			<header contenteditable=true>Nom de la formation - cliquez pour modifier</header>
            <nav>
                <div class=annee>${this.annee} - ${this.annee + 1}</div>
                <button class=plus>+</button>
                <button class=moins>-</button>

				<div class=entreprise contenteditable=true>Entreprise</div>
				<div class=universite contenteditable=true>Centre de formation</div>
				<div class=examens contenteditable=true>Examens</div>
            </nav>
            <main>${this.vueCalendrier(this.annee)}</main>	
            <footer>
				<div class=totaux></div>
                <button class=pdf>Export PDF</button>
                <button class=studea>Export vers STUDEA (à venir)</button>
            </footer>
        `;


		this.shadow.querySelector("nav>.plus").addEventListener("click", () => this.changeAnnee(1));
		this.shadow.querySelector("nav>.moins").addEventListener("click", () => this.changeAnnee(-1));
		this.shadow.querySelector("footer>.pdf").addEventListener("click", () => { window.print() });

		this.setEvents();
		this.restore();
	}

	changeAnnee(nb) {
		this.annee += nb;
		this.shadow.querySelector(".annee").innerHTML = `${this.annee} - ${this.annee + 1}`;
		this.shadow.querySelector("main").innerHTML = this.vueCalendrier(this.annee);
		this.setEvents();
	}

	vueCalendrier(annee) {
		let debut = new Date(annee, 8, 1); // 1er septembre
		let fin = new Date(annee + 1, 7, 31); // 31 aout année +1
		let jour = new Date(debut);

		let output = "";
		while (jour.getTime() <= fin.getTime()) {
			if (jour.getDate() == 1) { // Nouveau mois
				output += `<div><h2>${this.txtMois[jour.getMonth()]}</h2>`;
			}
			let classes = "";
			if (jour.getDay() == 0) {
				classes = "WE";
			}
			output += `
                <div class="jour ${classes}" data-date=${jour.toISOString().split("T")[0]}>
					<div class=semaine>
						${(jour.getDay() == 2)?this.getWeekNumber(jour):""}
						${(jour.getDay() == 1)?'<svg xmlns="http://www.w3.org/2000/svg" title=Coller class=paste width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"></path><rect x="8" y="2" width="8" height="4" rx="1" ry="1"></rect></svg><svg xmlns="http://www.w3.org/2000/svg" title=Copier class=copy width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>':""}
					</div>
                    <div class=txtJour>
                        ${this.txtJours[jour.getDay()]}
                        ${jour.getDate()}
                    </div>
                    <div class="matin" contenteditable=true></div>
                    <div class="apresmidi" contenteditable=true></div>
                </div>`;

			jour.setDate(jour.getDate() + 1);

			if (jour.getDate() == 1) { // Nouveau mois
				output += `</div>`;
			}
		}

		return output;
	}

	setEvents() {
		/* Jours fériés */
		this.joursFeries();

		/* Events */
		this.changeJourHandler = (event) => { this.changeJour(event) }
		this.copyHandler = (event) => { this.copy(event) }
		this.pasteHandler = (event) => { this.paste(event) }

		this.shadow.querySelectorAll('.jour>div:not(.semaine)').forEach(e => { e.addEventListener("click", this.changeJourHandler)})
		this.shadow.querySelectorAll('.jour .copy').forEach(e => { e.addEventListener("click", this.copyHandler)})
		this.shadow.querySelectorAll('.jour .paste').forEach(e => { e.addEventListener("click", this.pasteHandler)})
	}

	joursFeries() {
		// Origine du code : https://github.com/SocialGouv/jours-feries/blob/master/src/index.ts
		const addDays = (date, days) =>
			new Date(date.getTime() + days * 24 * 60 * 60 * 1000)

		const paques = function (year) {
			const a = year % 19
			const century = Math.floor(year / 100)
			const yearsAfterCentury = year % 100
			const d =
				(19 * a +
					century -
					Math.floor(century / 4) -
					Math.floor((Math.floor(century - (century + 8) / 25) + 1) / 3) +
					15) %
				30
			const e =
				(32 +
					2 * (century % 4) +
					2 * Math.floor(yearsAfterCentury / 4) -
					d -
					(yearsAfterCentury % 4)) %
				7
			const f = d + e - 7 * Math.floor((a + 11 * d + 22 * e) / 451) + 114
			const month = Math.floor(f / 31)
			const day = (f % 31) + 1

			return new Date(year, month - 1, day)
		}

		const year = this.annee;
		let fetes = {
			Armistice: new Date(year, 10, 11),
			Ascension: addDays(paques(year + 1), 39),
			Assomption: new Date(year + 1, 7, 15),
			"Fête Nationale": new Date(year + 1, 6, 14),
			"Fête du travail": new Date(year + 1, 4, 1),
			"Jour de l'an": new Date(year + 1, 0, 1),
			"Lundi de Pentecôte": addDays(paques(year + 1), 50),
			"Lundi de Pâques": addDays(paques(year + 1), 1),
			Noël: new Date(year, 11, 25),
			Toussaint: new Date(year, 10, 1),
			"Victoire des alliés": new Date(year + 1, 4, 8)
		}
		const fetesAlsace = {
			"Saint Étienne": new Date(year, 11, 26),
			"Vendredi Saint": addDays(paques(year + 1), -2)
		}

		if (this.zone == "alsace-moselle") {
			fetes = { ...fetes, ...fetesAlsace }
		}

		Object.values(fetes).forEach(jour => {
			this.shadow.querySelector(`[data-date="${jour.toISOString().split("T")[0]}"]`)?.classList.add("ferie");
		})
	}

	getWeekNumber(date) {
		const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
		// On se place au jeudi de la semaine courante (ISO standard)
		d.setUTCDate(d.getUTCDate() + 4 - (d.getUTCDay() || 7));
		const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
		const weekNumber = Math.ceil((((d - yearStart) / 86400000) + 1) / 7);
		
		return weekNumber;
	}

	changeJour(event) {
		if (event.currentTarget.classList.contains("txtJour")) {
			var elements = [
				event.currentTarget.nextElementSibling,
				event.currentTarget.nextElementSibling.nextElementSibling
			];
		} else {
			var elements = [event.currentTarget];
		}
		if (elements[0].classList.contains("entreprise")) {
			elements.forEach(e => {
				this.removeClasses(e);
				e.classList.add("universite");
			})
		} else if (elements[0].classList.contains("universite")) {
			elements.forEach(e => {
				this.removeClasses(e);
				e.classList.add("examens");
			})
		} else if (elements[0].classList.contains("examens")) {
			elements.forEach(e => {
				this.removeClasses(e);
			})
		} else {
			elements.forEach(e => {
				this.removeClasses(e);
				e.classList.add("entreprise");
			})
		}
		
		this.totaux();
		this.save();
	}
	removeClasses(e) {
		e.classList.remove("entreprise");
		e.classList.remove("examens");
		e.classList.remove("universite");
	}

	copy(event) {
		let current = event.currentTarget.closest(".jour");
		if(!current.classList.contains("select")) {
			this.shadow.querySelectorAll(".select").forEach(e=>{e.classList.remove("select")})
		}
		for(let i=0;i<6;i++) {
			current.classList.toggle("select");
			if(current.nextElementSibling) {
				current = current.nextElementSibling;
			} else {
				current = current.parentElement.nextElementSibling.querySelector(".jour");
			}
		}
		if(this.shadow.querySelector(".select")) {
			this.shadow.querySelectorAll(".paste").forEach(e=>e.classList.add("active"));
		} else {
			this.shadow.querySelectorAll(".paste").forEach(e=>e.classList.remove("active"));
		}
	}

	paste(event) {
		let selected = this.shadow.querySelectorAll(".select");
		let current = event.currentTarget.closest(".jour");
		for(let i=0;i<6;i++) {
			if(!current.classList.contains("ferie")) {
				current.querySelector(".matin").className = Array.from(selected)[i].querySelector(".matin").className;
				current.querySelector(".apresmidi").className = Array.from(selected)[i].querySelector(".apresmidi").className;
			}
			
			if(current.nextElementSibling) {
				current = current.nextElementSibling;
			} else {
				current = current.parentElement.nextElementSibling.querySelector(".jour");
			}
		}
		this.totaux();
		this.save();
	}

	totaux() {
		let entreprise = this.shadow.querySelectorAll(".jour>.entreprise").length;
		let universite = this.shadow.querySelectorAll(".jour>.universite").length;
		let examens = this.shadow.querySelectorAll(".jour>.examens").length;
		this.shadow.querySelector(".totaux").innerHTML = `
			${entreprise / 2} jour(s) en entreprise<br>
			${universite / 2} jour(s) en centre de formation<br>
			${examens / 2} jour(s) en examens
		`;
	}

	save(){
		let output = {};
		this.shadow.querySelectorAll("[data-date]").forEach(jour=>{
			output[jour.dataset.date] = {
				matin: jour.querySelector(".matin").className,
				txtMatin: jour.querySelector(".matin").innerText,
				apresmidi: jour.querySelector(".apresmidi").className,
				txtApresmidi: jour.querySelector(".apresmidi").innerText
			}
		})
		localStorage.setItem("data", JSON.stringify(output))
	}
	restore(){
		let data = JSON.parse(localStorage.getItem("data")) || {};
		Object.entries(data).forEach(([txtJour, donnees])=>{
			let jour = this.shadow.querySelector(`[data-date="${txtJour}"]`);
			jour.querySelector(".matin").className = donnees.matin || "matin";
			jour.querySelector(".matin").innerText = donnees.txtMatin || "";
			jour.querySelector(".apresmidi").className = donnees.apresmidi || "apresmidi";
			jour.querySelector(".apresmidi").innerText = donnees.txtApresmidi || "";
		})
		this.totaux();
	}
}
customElements.define('calendrier-cfau', calCFAU);