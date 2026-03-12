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
		this.saved = true;

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
					margin: 0 178px 4px 48px;
				}
				header>input {
					font-size: 24px;
					width: 100%;
					border: none;
					padding: 4px 8px;
				}
				header>.help {
					position: absolute;
					left: 6px;
					top: 6px;
					width: 40px;
					height: 40px;
					border-radius: 100%;
					display: flex;
					justify-content: center;
					align-items: center;
					font-size: 24px;
					background: #c09;
					color: #fff;
					cursor: pointer;
					animation: zioumzioum 2s infinite;
				}
				@keyframes zioumzioum {
					0%{rotate: 0}
					10%{rotate: 20deg}
					20%{rotate: -20deg}
					30%{rotate: 20deg}
					40%{rotate: 0deg}
				}
                nav {
                   	font-family: Arial;
                    display: flex;
					align-items: center;
                    gap: 4px;
                    margin: 16px 8px 4px 8px;
					padding-right: 170px;
                    container-type: inline-size;
                    container-name: module;
					.annee {
						font-size: 24px;
                    	font-weight: bold;
					}
					.dates{
						margin-left: auto;
					}
					.entreprise, .universite, .examens {
						display: flex;
						align-items: center;
						padding: 2px 4px;
					}
					img{
						position: absolute;
						top: 0;
						right: 0;
					}
                }

                main {
                    display: grid;
                    grid-template-columns: repeat(var(--nb-colonnes), minmax(0, 1fr));
                    gap: 1px;
                    background: #ddd;
                    padding: 1px;
					margin: 0 8px;
                }

                @container (width < 1400px) {
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
				h2{
					white-space: nowrap;
					overflow: hidden;
					text-overflow: ellipsis;
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
				.desactive {
					background: #eee;
                    pointer-events: none;
				}
				.ferie {
                    background: #ccc;
                }
                .WE {
                    background: #aaa;
                    pointer-events: none;
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
					margin-left: 8px;
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

				.fondNoir {
					background: rgba(0,0,0,0.8);
					position: fixed;
					top: 0;
					left: 0;
					right: 0;
					bottom: 0;
					display: flex;
					justify-content: center;
					padding: 48px;
					transition: 0.4s;
					transform-origin: 20px 20px;
					opacity: 0;
					transform: scale(0);
					cursor: pointer;
				}
				.infos {
					background: #FFF;
					font-family: verdana;
					padding: 24px 48px;
					border-radius: 48px;
					overflow: auto;
					max-width: 800px;
				}
				.fondNoir.ouvrir{
					opacity: 1;
					transform: scale(1);
				}

				@media print {
					* {
						-webkit-print-color-adjust: exact;
						print-color-adjust: exact;
					}
					:host{
						zoom: 70%;
					}
					button, 
					header>.help,
					fond-noir {
						display: none;
					}
					h2{
						font-size: 1.1em;
					}
					.jour{
						font-size: 11px;
						grid-template-columns: 12px 50px 1fr 1fr;
					}
					.copy{
						display: none;
					}
					header {
						margin: 0 178px 4px 0;
					}
					header, nav, main, footer{
						margin-left: 0;
						margin-right: 0;
					}
					.txtJour {
						padding: 2px 0;
						font-size:16px;
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
					<div class=dates>
						<label onclick="event.stopPropagation()">Début <input type=date name=debut></label>
						<label onclick="event.stopPropagation()">Fin <input type=date name=fin></label>
					</div>
					<hr>
					Commencer un nouveau calendrier de formation
					
				</div>
				<label class=import>
					Importer un fichier sauvegardé<hr>
					<input type="file" id="fileInput" accept=".xlsx">
				</label>
			</div>
			<header>
				<input placeholder="Nom de la formation - cliquez pour modifier">
				<div class=help>?</div>
			</header>
            <nav>
                <div class=annee>${this.annee} - ${this.annee+1}</div>
                <!--<button class=plus>+</button>
                <button class=moins>-</button>-->

				<div class=dates></div>

				<div class=entreprise>Entreprise</div>
				<div class=universite>Centre de formation</div>
				<div class=examens>Examens</div>

				<img src="data:image/png;base64,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" alt="Logo CFAU">
            </nav>
            <main style="--nb-colonnes:12"></main>	
            <footer>
				<div class=totaux></div>
                <button class=pdf>Export PDF</button>
                <button class=studea>Sauvegarder</button>
            </footer>
			<div class=fondNoir>
				<div class="infos" contenteditable=true spellcheck=true>
					<h2>Quel est cet outil ?</h2>
					<p>Cet outil permet de créer et enregistrer vos calendriers d'apprentissage. Vous pouvez créer plusieurs calendriers pour vos différentes formations et les enregistrer sur votre ordinateur au format xlsx.</p>
					<p>Nous vous recommandons de ne pas modifier le fichier xlsx sans passer par cet outil afin de ne pas corrompre les données.</p>

					<h2>Etapes</h2>
					<p>
						<ul>
							<li>Après avoir crée un nouveau calendrier, modifier le nom de la formation en haut de l'interface.</li>
							<li>Cliquez sur le texte d'un jour pour modifier toute la journée.</li>
							<li>Cliquez juste à coté pour modifier une demi journée.</li>
							<li>Utilisez le symbole <rect x="8" y="2" width="8" height="4" rx="1" ry="1"></rect></svg><svg xmlns="http://www.w3.org/2000/svg" title=Copier class=copy width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg> pour copier la semaine entière, vous pourrez la coller ailleurs.</li>
							<li>Pensez à sauvegarder la formation pour pouvoir la rouvrir une autre fois.</li>
							<li>En revenant sur l'outil, vous pourrez importer une formation précédemment sauvegardée.</li>
						<ul>
					</p>
				</div>
			</div>
        `;
		
		/* Date par défaut pour nouvelle formation */
		this.shadow.querySelector("input[name=debut]").value = this.debut.toISOString().split('T')[0];
		this.shadow.querySelector("input[name=fin]").value = this.fin.toISOString().split('T')[0];

		/* Event */
		this.shadow.querySelector(".accueil>.new").addEventListener("click", (event)=>{
			this.debutApp = new Date(this.shadow.querySelector("input[name=debut]").value);
			this.finApp = new Date(this.shadow.querySelector("input[name=fin]").value);
			this.debut = new Date(Date.UTC(this.debutApp.getUTCFullYear(), this.debutApp.getUTCMonth(), 1));
			this.fin = new Date(Date.UTC(this.finApp.getUTCFullYear(), this.finApp.getUTCMonth()+1, 0));
			this.shadow.querySelector("main").innerHTML = this.vueCalendrier(this.annee);
			this.shadow.querySelector("nav>.dates").innerText = `Du ${this.debutApp.toISOString().split('T')[0].split("-").reverse().join("/")} au ${this.finApp.toISOString().split('T')[0].split("-").reverse().join("/")}`;
			this.setEvents();
			this.shadow.querySelector("main").style.setProperty("--nb-colonnes", this.shadow.querySelector("main").children.length);
			event.currentTarget.parentElement.remove();
		});
		this.shadow.querySelector(".help").addEventListener("click", ()=>{this.shadow.querySelector(".fondNoir").classList.toggle("ouvrir")});
		this.shadow.querySelector(".fondNoir").addEventListener("click", ()=>{this.shadow.querySelector(".fondNoir").classList.toggle("ouvrir")});
		/*this.shadow.querySelector("nav>.plus").addEventListener("click", () => this.changeAnnee(1));
		this.shadow.querySelector("nav>.moins").addEventListener("click", () => this.changeAnnee(-1));*/
		this.shadow.querySelector("footer>.pdf").addEventListener("click", () => { 
			document.title = this.shadow.querySelector("header>input").value;
			this.shadow.querySelectorAll(".select").forEach(e=>{e.classList.remove("select")});
			this.shadow.querySelectorAll(".paste").forEach(e=>e.classList.remove("active"));
			window.print();
		});
		this.shadow.querySelector("footer>.studea").addEventListener("click", () => { this.exportXLSX() });
		window.addEventListener("beforeunload", (event)=>{
			if(!this.saved) event.preventDefault();
		});

		/* Import fichier */
		this.shadow.querySelector("#fileInput").addEventListener("change", async (event) => {
			const file = event.target.files[0];

			if (!file) return;

			const reader = new FileReader();

			reader.onload = async (e)=>{
				const data = e.target.result;

				const workbook = await XlsxPopulate.fromDataAsync(data);

				const sheet = workbook.sheet("Import");

				this.debutApp = new Date(sheet.cell("O1").value());
				this.finApp = new Date(sheet.cell("O2").value());
				this.debut = new Date(Date.UTC(this.debutApp.getUTCFullYear(), this.debutApp.getUTCMonth(), 1));
				this.fin = new Date(Date.UTC(this.finApp.getUTCFullYear(), this.finApp.getUTCMonth()+1, 0));

				this.shadow.querySelector("main").innerHTML = this.vueCalendrier(this.annee);
				this.shadow.querySelector("nav>.dates").innerText = `Du ${this.debutApp.toISOString().split('T')[0].split("-").reverse().join("/")} au ${this.finApp.toISOString().split('T')[0].split("-").reverse().join("/")}`;
				this.setEvents();
				this.shadow.querySelector("main").style.setProperty("--nb-colonnes", this.shadow.querySelector("main").children.length);

				this.shadow.querySelector("header>input").value = file.name.split(".").toSpliced(-1);
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
				classes = "WE ";
			}
			if (jour.getTime() < this.debutApp.getTime() || jour.getTime() > this.finApp.getTime()) {
				classes += "desactive";
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

			jour.setUTCDate(jour.getUTCDate() + 1);

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
			Armistice2: new Date(year+1, 10, 11, 12),
			Ascension: addDays(paques(year + 1), 39 + 1),
			Assomption: new Date(year + 1, 7, 15, 12),
			Assomption2: new Date(year, 7, 15, 12),
			"Fête Nationale": new Date(year + 1, 6, 14, 12),
			"Fête Nationale2": new Date(year, 6, 14, 12),
			"Fête du travail": new Date(year + 1, 4, 1, 12),
			"Jour de l'an": new Date(year + 1, 0, 1, 12),
			"Lundi de Pentecôte": addDays(paques(year + 1), 50 + 1),
			"Lundi de Pâques": addDays(paques(year + 1), 1 + 1),
			Noël: new Date(year, 11, 25, 12),
			Noël2: new Date(year+1, 11, 25, 12),
			Toussaint: new Date(year, 10, 1, 12),
			Toussaint2: new Date(year+1, 10, 1, 12),
			"Victoire des alliés": new Date(year + 1, 4, 8, 12)
		}
		const fetesAlsace = {
			"Saint Étienne": new Date(year, 11, 26, 12),
			"Saint Étienne2": new Date(year+1, 11, 26, 12),
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
		this.shadow.querySelectorAll(".select").forEach(e=>{e.classList.remove("select")});
		this.shadow.querySelectorAll(".paste").forEach(e=>e.classList.remove("active"));
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
		this.saved = false;
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

	exportXLSX(){
		this.saved = true;
		XlsxPopulate.fromBlankAsync()
            .then(workbook => {
				const sheet = workbook.sheet(0);
                sheet.name("Import");
				sheet.cell("O1").value(this.debutApp.toISOString().split("T")[0]);
				sheet.cell("O2").value(this.finApp.toISOString().split("T")[0]);
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

				saveFile(this.shadow.querySelector("header>input").value, workbook);
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