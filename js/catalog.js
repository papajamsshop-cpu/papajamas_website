/* =============================================================
   PAPA JAMS — catalogue
   -------------------------------------------------------------
   C'EST LE SEUL FICHIER À MODIFIER POUR METTRE LE STOCK À JOUR.
   (Marc : ajoute / supprime / corrige des lignes, puis recharge
   la page. Rien d'autre à toucher.)

   Chaque ligne = un produit :

   id        : identifiant unique (ne pas répéter)
   section   : "novedades" | "segunda-mano" | "preventas"
               | "distribucion" | "merch"
   artist    : artiste
   title     : titre
   label     : sello
   cat       : nº de referencia (catálogo)
   format    : '12"', 'LP', '2×LP', '7"', 'Cassette', 'T-shirt'
   price     : precio en euros (nombre)
   oldPrice  : precio tachado (opcional)
   sold      : true  -> aparece "Agotado" y no se puede añadir
   condition : estado del disco, p. ej. "VG+", "NM" (2ª mano)
   shipDate  : "2026-12-12" (fecha de salida, sólo preventas)
   sizes     : ["S","M","L","XL","XXL"] (sólo merch)
   hue       : color de la portada generada:
               "green" | "yellow" | "magenta" | "cyan" | "white" | "grey"
   ============================================================= */

window.PAPA_CATALOG = [
  /* ---------------- NOUVEAUTÉS / NOVEDADES ---------------- */
  { id: "pjams003", section: "novedades", artist: "Maruxa", title: "Nocturne Bleu", label: "Papa Jams", cat: "PJAMS003", format: '12" EP', price: 16, hue: "green", genre: "House" },
  { id: "pjams002", section: "novedades", artist: "Selva Sound", title: "Papa's Groove", label: "Papa Jams", cat: "PJAMS002", format: '7"', price: 12, hue: "yellow", genre: "Disco" },
  { id: "pjams001", section: "novedades", artist: "V/A", title: "Tard La Nuit", label: "Papa Jams", cat: "PJAMS001", format: "2×LP", price: 28, hue: "magenta", genre: "V/A" },
  { id: "ds014", section: "novedades", artist: "Lorenzo Mora", title: "Circuito Cerrado", label: "Distrito Sur", cat: "DS014", format: '12"', price: 14.5, hue: "cyan", genre: "Techno" },
  { id: "crs007", section: "novedades", artist: "Kalimba Trio", title: "Ritmo Suave", label: "Costa Rica Sound", cat: "CRS007", format: "LP", price: 19, hue: "white", genre: "Latin" },
  { id: "pjams004", section: "novedades", artist: "DJ Feria", title: "Balearic Tapes Vol. 2", label: "Papa Jams", cat: "PJAMS004", format: "Cassette", price: 9, hue: "green", genre: "Balearic" },

  /* ---------------- SEGUNDA MANO ---------------- */
  { id: "sh01", section: "segunda-mano", artist: "Frankie Knuckles", title: "Beyond the Mix", label: "Virgin", cat: "V 2764", format: "2×LP", price: 18, condition: "VG+", hue: "white", genre: "House" },
  { id: "sh02", section: "segunda-mano", artist: "Astral Projection", title: "Trust in Trance Vol. 3", label: "Phonokol", cat: "PHO 042", format: "2×LP", price: 22, condition: "VG", hue: "cyan", genre: "Trance" },
  { id: "sh03", section: "segunda-mano", artist: "The Orb", title: "Adventures Beyond the Ultraworld", label: "Big Life", cat: "BIGT 21", format: "2×LP", price: 24, condition: "VG+", hue: "magenta", genre: "Ambient" },
  { id: "sh04", section: "segunda-mano", artist: "Tino Casal", title: "Embrujada", label: "Hispavox", cat: "17 9984 2", format: "LP", price: 26, condition: "VG", hue: "yellow", genre: "Pop" },
  { id: "sh05", section: "segunda-mano", artist: "Los Planetas", title: "Una semana en el motor de un autobús", label: "RCA", cat: "74321 1", format: "2×LP", price: 32, condition: "NM", hue: "green", genre: "Indie" },
  { id: "sh06", section: "segunda-mano", artist: "Underground Resistance", title: "Revolution for Change", label: "UR", cat: "UR 005", format: '2×12"', price: 38, condition: "VG+", hue: "grey", genre: "Techno" },
  { id: "sh07", section: "segunda-mano", artist: "V/A", title: "Balearic Ibiza 1988", label: "Blanco y Negro", cat: "BYN 5012", format: "LP", price: 45, condition: "G+", hue: "white", genre: "Balearic" },
  { id: "sh08", section: "segunda-mano", artist: "Bola de Nieve", title: "Ámame", label: "Areito", cat: "LD-3804", format: "LP", price: 20, condition: "VG", hue: "yellow", genre: "Cuban" },
  { id: "sh09", section: "segunda-mano", artist: "Manu Chao", title: "Clandestino", label: "Virgin", cat: "V 2860", format: "LP", price: 14, condition: "VG+", hue: "magenta", genre: "Latin" },
  { id: "sh10", section: "segunda-mano", artist: "Mr. Fingers", title: "Introduction", label: "Trax", cat: "TX 138", format: "2×LP", price: 29, condition: "VG", hue: "cyan", genre: "House" },
  { id: "sh11", section: "segunda-mano", artist: "Sueno Latino", title: "Sueno Latino", label: "Media", cat: "MEDIA 1", format: "2×LP", price: 34, condition: "VG+", hue: "green", genre: "House" },
  { id: "sh12", section: "segunda-mano", artist: "Drexciya", title: "Neptunes Lair", label: "Tresor", cat: "TRESOR 111", format: "2×LP", price: 42, condition: "VG+", hue: "grey", genre: "Techno", sold: true },

  /* ---------------- PREVENTAS / PRÉCOMMANDES ---------------- */
  { id: "pr01", section: "preventas", artist: "Maruxa", title: "Nocturne Bleu Remixes", label: "Papa Jams", cat: "PJAMS005", format: '12"', price: 17, shipDate: "2026-12-12", hue: "cyan", genre: "House" },
  { id: "pr02", section: "preventas", artist: "Hugo Praxis", title: "Sistema Solar", label: "Distrito Sur", cat: "DS015", format: "LP", price: 21, shipDate: "2027-01-16", hue: "yellow", genre: "Latin" },
  { id: "pr03", section: "preventas", artist: "V/A", title: "Papa Jams Cuts Vol. 1", label: "Papa Jams", cat: "PJAMS006", format: "2×LP", price: 30, shipDate: "2027-02-06", hue: "green", genre: "V/A" },
  { id: "pr04", section: "preventas", artist: "Nyx & The Static", title: "Night Bus Sessions", label: "Costa Rica Sound", cat: "CRS008", format: '12"', price: 15.5, shipDate: "2026-11-28", hue: "magenta", genre: "Electro" },
  { id: "pr05", section: "preventas", artist: "Selva Sound", title: "Ritual Dub", label: "Papa Jams", cat: "PJAMS007", format: "LP", price: 22, sold: true, hue: "white", genre: "Dub" },

  /* ---------------- DISTRIBUCIÓN / LABEL ---------------- */
  { id: "ds009", section: "distribucion", artist: "V/A", title: "Distrito Sur Vol. 3", label: "Distrito Sur", cat: "DS009", format: "2×LP", price: 24, hue: "magenta", genre: "V/A" },
  { id: "crs004", section: "distribucion", artist: "Rio Seco", title: "Cumbia Profunda", label: "Costa Rica Sound", cat: "CRS004", format: "LP", price: 18, hue: "yellow", genre: "Cumbia" },
  { id: "crs006", section: "distribucion", artist: "Ana Lucía", title: "Cassette Culture", label: "Costa Rica Sound", cat: "CRS006", format: "Cassette", price: 10, hue: "cyan", genre: "Ambient" },
  { id: "ds011", section: "distribucion", artist: "Los Ecos", title: "Ruta 40", label: "Distrito Sur", cat: "DS011", format: '12"', price: 13, hue: "green", genre: "Techno" },
  { id: "ds013", section: "distribucion", artist: "Mala Fama", title: "Bajo Cero", label: "Distrito Sur", cat: "DS013", format: '12"', price: 13, hue: "grey", genre: "Techno" },

  /* ---------------- MERCH ---------------- */
  { id: "mer01", section: "merch", artist: "PAPA JAMS", title: "Logo tee — black", label: "Papa Jams", cat: "TEE-01", format: "T-shirt", price: 25, sizes: ["S", "M", "L", "XL", "XXL"], hue: "green", genre: "Merch" },
  { id: "mer02", section: "merch", artist: "PAPA JAMS", title: "Emblem tee — white", label: "Papa Jams", cat: "TEE-02", format: "T-shirt", price: 25, sizes: ["S", "M", "L", "XL", "XXL"], hue: "white", genre: "Merch" },
  { id: "mer03", section: "merch", artist: "PAPA JAMS", title: "Rave mark tee — green", label: "Papa Jams", cat: "TEE-03", format: "T-shirt", price: 25, sizes: ["S", "M", "L", "XL"], hue: "green", genre: "Merch" },
  { id: "mer04", section: "merch", artist: "PAPA JAMS", title: "Jams wordmark tee — yellow", label: "Papa Jams", cat: "TEE-04", format: "T-shirt", price: 25, sizes: ["S", "M", "L", "XL", "XXL"], hue: "yellow", genre: "Merch" },
  { id: "mer05", section: "merch", artist: "PAPA JAMS", title: "Sticker pack (5 units)", label: "Papa Jams", cat: "STK-01", format: "Stickers", price: 6, hue: "magenta", genre: "Merch" }
];
