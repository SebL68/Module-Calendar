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
		/*let d = new Date();
		if (d.getMonth() < 8) { // Septembre
			this.annee = d.getFullYear() - 1;
		} else {
			this.annee = d.getFullYear();
		}*/
		this.annee = 2026;
		this.debut = new Date(Date.UTC(this.annee, 8, 1)); // 1er septembre
		this.fin = new Date(Date.UTC(this.annee + 1, 7, 31)); // 31 aout année +1

		/* Style */
		this.shadow.innerHTML = `
            <style>
                :host {
                    display: block;
                    container-type: inline-size;
					position: relative;
                }
				.accueil{
					font-family: verdana;
					text-align: center;
					position: fixed;
					top: 0;
					left: 0;
					right: 0;
					bottom: 0;
					z-index: 10;
					background: #09c;
					display: flex;
					justify-content: center;
					align-items: center;
					gap: 20px;
				}
				.accueil>*{
					background: #fff;
					cursor: pointer;
					padding: 16px 32px;
					border-radius: 16px;
					max-width: 220px;
					font-size: 24px;
				}
				.accueil>*:hover{
					box-shadow: 0 4px 4px 4px rgba(0,0,0,0.26);
				}
				.accueil>.new label {
					font-size: 14px;
					display: flex;
					justify-content: space-between;
				}
				header {
					background: #000;
					color: #fff;
					font-size: 24px;
					padding: 4px 8px;
					margin: 0 0 4px 0;
				}
                nav {
                   	font-family: Arial;
                    display: flex;
                    gap: 4px;
                    margin: 0 8px 4px 8px;
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
                    grid-template-columns: repeat(var(--nb-colonnes), 1fr);
                    gap: 1px;
                    background: #ddd;
                    padding: 1px;
					margin: 0 8px;
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
					margin-right: 8px;
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
			<div class=accueil>
				<div class=new>
					Commencer un nouveau calendrier de formation<hr>
					<div class=dates>
						<label onclick="event.stopPropagation()">Début <input type=date name=debut></label>
						<label onclick="event.stopPropagation()">Fin <input type=date name=fin></label>
					</div>
				</div>
				<label class=import>
					Importer un fichier sauvegardé<hr>
					<input type="file" id="fileInput" accept=".xlsx">
				</label>
			</div>
			<header contenteditable=true>Nom de la formation - cliquez pour modifier</header>
            <nav>
                <div class=annee>${this.annee} - ${this.annee+1}</div>
                <!--<button class=plus>+</button>
                <button class=moins>-</button>-->

				<div class=entreprise>Entreprise</div>
				<div class=universite>Centre de formation</div>
				<div class=examens>Examens</div>
            </nav>
            <main style="--nb-colonnes:12">${this.vueCalendrier()}</main>	
            <footer>
				<div class=totaux></div>
                <button class=pdf>Export PDF</button>
                <button class=studea>Export vers STUDEA</button>
            </footer>
        `;
		
		/* Date pour nouvelle formation */
		this.shadow.querySelector("input[name=debut]").value = this.debut.toISOString().split('T')[0];
		this.shadow.querySelector("input[name=fin]").value = this.fin.toISOString().split('T')[0];

		/* Event */
		this.shadow.querySelector(".accueil>.new").addEventListener("click", (event)=>{
			this.debut = new Date(this.shadow.querySelector("input[name=debut]").value);
			this.fin = new Date(this.shadow.querySelector("input[name=fin]").value);
			this.shadow.querySelector("main").innerHTML = this.vueCalendrier(this.annee);
			this.setEvents();
			this.shadow.querySelector("main").style.setProperty("--nb-colonnes", this.shadow.querySelector("main").children.length);
			event.currentTarget.parentElement.remove();
		});
		/*this.shadow.querySelector("nav>.plus").addEventListener("click", () => this.changeAnnee(1));
		this.shadow.querySelector("nav>.moins").addEventListener("click", () => this.changeAnnee(-1));*/
		this.shadow.querySelector("footer>.pdf").addEventListener("click", () => { 
			document.title = this.shadow.querySelector("header").innerText;
			window.print();
		});
		this.shadow.querySelector("footer>.studea").addEventListener("click", () => { this.exportSTUDEA() });
		/*window.addEventListener("beforeunload", (event)=>{
			 event.preventDefault();
		});*/

		/* Import fichier */
		this.shadow.querySelector("#fileInput").addEventListener("change", async (event) => {
			const file = event.target.files[0];

			if (!file) return;

			const reader = new FileReader();

			reader.onload = async (e)=>{
				const data = e.target.result;

				const workbook = await XlsxPopulate.fromDataAsync(data);

				const sheet = workbook.sheet("Import");

				this.debut = new Date(sheet.cell("O1").value());
				this.fin = new Date(sheet.cell("O2").value());
				this.shadow.querySelector("main").innerHTML = this.vueCalendrier(this.annee);
				this.setEvents();
				this.shadow.querySelector("main").style.setProperty("--nb-colonnes", this.shadow.querySelector("main").children.length);

				this.shadow.querySelector("header").innerText = file.name.split(".").toSpliced(-1);
				let ligne = 3;

				while(sheet.cell("K"+ligne).value() !== undefined) {
					if(sheet.cell("K"+ligne).value() === 0){
						ligne++;
						continue;
					}
					let date = sheet.cell("A"+ligne).value().split("/").reverse().join("-");
					let creneau = sheet.cell("B"+ligne).value() == "8:00"?"matin":"apresmidi";
					let type;
					switch(sheet.cell("K"+ligne).value()){
						case "Entreprise":
							type = "entreprise";
							break;
						case "Centre":
							type = "universite";
							break;
						case "Examens":
							type = "examens";
							break;
					}
					this.shadow.querySelector(`[data-date="${date}"]>.${creneau}`).classList.add(type)

					ligne++;
				}
				this.totaux();
				this.shadow.querySelector(".accueil").remove();
			};

			reader.readAsArrayBuffer(file);
		});

		this.setEvents();
		this.restore();
	}

	changeAnnee(nb) {
		this.annee += nb;
		this.shadow.querySelector(".annee").innerHTML = `${this.annee} - ${this.annee + 1}`;
		this.shadow.querySelector("main").innerHTML = this.vueCalendrier(this.annee);
		this.setEvents();
	}

	vueCalendrier() {
		//let debut = new Date(Date.UTC(annee, 8, 1)); // 1er septembre
		//let fin = new Date(Date.UTC(annee + 1, 7, 31)); // 31 aout année +1
		let jour = new Date(this.debut);

		let output = "";
		while (jour.getTime() <= this.fin.getTime()) {
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
                    <div class="matin"></div>
                    <div class="apresmidi"></div>
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
			Armistice: new Date(year, 10, 11, 12),
			Ascension: addDays(paques(year + 1), 39 + 1),
			Assomption: new Date(year + 1, 7, 15, 12),
			"Fête Nationale": new Date(year + 1, 6, 14, 12),
			"Fête du travail": new Date(year + 1, 4, 1, 12),
			"Jour de l'an": new Date(year + 1, 0, 1, 12),
			"Lundi de Pentecôte": addDays(paques(year + 1), 50 + 1),
			"Lundi de Pâques": addDays(paques(year + 1), 1 + 1),
			Noël: new Date(year, 11, 25, 12),
			Toussaint: new Date(year, 10, 1, 12),
			"Victoire des alliés": new Date(year + 1, 4, 8, 12)
		}
		const fetesAlsace = {
			"Saint Étienne": new Date(year, 11, 26, 12),
			"Vendredi Saint": addDays(paques(year + 1), -2 + 1)
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
		/*let output = {};
		this.shadow.querySelectorAll("[data-date]").forEach(jour=>{
			output[jour.dataset.date] = {
				matin: jour.querySelector(".matin").className,
				txtMatin: jour.querySelector(".matin").innerText,
				apresmidi: jour.querySelector(".apresmidi").className,
				txtApresmidi: jour.querySelector(".apresmidi").innerText
			}
		})
		localStorage.setItem("data", JSON.stringify(output))*/
	}
	restore(){
		/*let data = JSON.parse(localStorage.getItem("data")) || {};
		Object.entries(data).forEach(([txtJour, donnees])=>{
			let jour = this.shadow.querySelector(`[data-date="${txtJour}"]`);
			jour.querySelector(".matin").className = donnees.matin || "matin";
			jour.querySelector(".matin").innerText = donnees.txtMatin || "";
			jour.querySelector(".apresmidi").className = donnees.apresmidi || "apresmidi";
			jour.querySelector(".apresmidi").innerText = donnees.txtApresmidi || "";
		})
		this.totaux();*/
	}

	exportSTUDEA(){
		XlsxPopulate.fromBlankAsync()
            .then(workbook => {
				const sheet = workbook.sheet(0);
                sheet.name("Import");
				sheet.cell("O1").value(this.debut.toISOString().split("T")[0]);
				sheet.cell("O2").value(this.fin.toISOString().split("T")[0]);
				sheet.range("A1:K1").value([[
					"Date début", "Horaire début", "Horaire Fin", "Titre", "Periode", "Email Formateur", "Salle de cours", "Groupe", "Matière", "Apprenti", "activité"
				]])

				let ligne = 3;
				this.shadow.querySelectorAll(".jour>.entreprise, .jour>.examens, .jour>.universite").forEach(creneau=>{
					let hDebut, hFin, type, periode;
					let date = creneau.closest(".jour").dataset.date.split("-").reverse().join("/");
					
					if(creneau.classList.contains("matin")) {
						hDebut = "8:00";
						hFin = "12:00";
					} else {
						hDebut = "14:00";
						hFin = "17:00";
					}
					
					if(creneau.classList.contains("entreprise")) {
						type = "Entreprise";
						periode = 0;
					} else if(creneau.classList.contains("examens")) {
						type = "Examens";
						periode = 1;
					} else if(creneau.classList.contains("universite")){
						type = "Centre";
						periode = 1;
					} else {
						type = 0;
						periode = "";
					}

					sheet.range(`A${ligne}:K${ligne}`).value([
						[
							date, hDebut, hFin, "", periode, "", "", "", "", "", type
						]
					])

					ligne++;
				})

				saveFile(this.shadow.querySelector("header").innerText, workbook);
			})
	}
}
customElements.define('calendrier-cfau', calCFAU);

function getExcel(obj, xlsxName) {
	return fetch(xlsxName)
		.then(function (response) { return response.blob() })
		.then(function (blob) {
			return blob;
		})
}

function saveFile(name, workbook) {
	workbook.outputAsync()
	.then(function (blob) {
		var url = window.URL.createObjectURL(blob);
		var a = document.createElement("a");
		document.body.appendChild(a);
		a.href = url;
		a.download = name + ".xlsx";
		a.click();
		window.URL.revokeObjectURL(url);
		document.body.removeChild(a);
	});
}