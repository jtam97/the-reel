export interface HighlightEvent {
  date: string;
  label: string;
  description: string;
}

export const highlights: HighlightEvent[] = [
  // 1920s–1930s
  { date: "1927-10-06", label: "THE JAZZ SINGER", description: "The first feature-length 'talkie' ends the silent film era." },
  { date: "1937-12-21", label: "SNOW WHITE", description: "Disney's Snow White and the Seven Dwarfs — the first full-length animated feature." },
  { date: "1939-08-15", label: "WIZARD OF OZ", description: "The Wizard of Oz premieres in Hollywood — 'We're not in Kansas anymore.'" },
  { date: "1939-12-15", label: "GONE WITH THE WIND", description: "Gone with the Wind premieres in Atlanta — the golden age's crowning jewel." },

  // 1940s
  { date: "1941-05-01", label: "CITIZEN KANE", description: "Orson Welles' Citizen Kane premieres — widely regarded as the greatest film ever made." },
  { date: "1942-11-26", label: "CASABLANCA", description: "Casablanca premieres — 'Here's looking at you, kid.'" },
  { date: "1946-12-20", label: "IT'S A WONDERFUL LIFE", description: "Frank Capra's holiday classic premieres — a box office flop turned cultural treasure." },

  // 1950s
  { date: "1950-08-25", label: "SUNSET BOULEVARD", description: "Billy Wilder's dark Hollywood satire — 'I'm ready for my close-up.'" },
  { date: "1954-08-04", label: "REAR WINDOW", description: "Hitchcock's Rear Window premieres — suspense perfected." },
  { date: "1959-03-29", label: "SOME LIKE IT HOT", description: "Billy Wilder's comedy masterpiece with Monroe, Lemmon & Curtis — 'Nobody's perfect.'" },

  // 1960s
  { date: "1960-06-16", label: "PSYCHO", description: "Hitchcock's Psycho shocks audiences — the shower scene changes horror forever." },
  { date: "1961-10-18", label: "WEST SIDE STORY", description: "West Side Story premieres — reinventing the American musical." },
  { date: "1962-10-05", label: "DR. NO", description: "Dr. No premieres in London — James Bond is born." },
  { date: "1968-04-03", label: "2001: A SPACE ODYSSEY", description: "Kubrick's 2001 premieres — cinema reaches the infinite." },
  { date: "1969-06-18", label: "EASY RIDER", description: "Easy Rider premieres — the birth of New Hollywood." },

  // 1970s
  { date: "1971-12-15", label: "A CLOCKWORK ORANGE", description: "Kubrick's dystopian nightmare hits theaters — brilliant and disturbing." },
  { date: "1972-03-24", label: "THE GODFATHER", description: "The Godfather premieres — cinema's greatest achievement." },
  { date: "1974-12-20", label: "GODFATHER PART II", description: "The rare sequel that matches the original — Al Pacino cements Michael Corleone." },
  { date: "1975-06-20", label: "JAWS", description: "Spielberg's Jaws invents the summer blockbuster — don't go in the water." },
  { date: "1976-11-21", label: "ROCKY", description: "Stallone's Rocky premieres — the ultimate underdog story." },
  { date: "1977-05-25", label: "STAR WARS", description: "A New Hope changes cinema forever." },
  { date: "1979-08-15", label: "APOCALYPSE NOW", description: "Coppola's Vietnam epic premieres — 'I love the smell of napalm in the morning.'" },
  { date: "1979-05-25", label: "ALIEN", description: "Ridley Scott's Alien premieres — 'In space, no one can hear you scream.'" },

  // 1980s
  { date: "1980-05-21", label: "EMPIRE STRIKES BACK", description: "The Empire Strikes Back — 'No, I am your father.' Cinema's greatest twist." },
  { date: "1980-05-23", label: "THE SHINING", description: "Kubrick's The Shining — 'Here's Johnny!' Horror redefined." },
  { date: "1981-06-12", label: "RAIDERS OF THE LOST ARK", description: "Indiana Jones debuts — Spielberg and Lucas create an icon." },
  { date: "1982-06-11", label: "E.T.", description: "E.T. the Extra-Terrestrial — Spielberg makes the world cry. Becomes highest-grossing film." },
  { date: "1982-06-25", label: "BLADE RUNNER", description: "Ridley Scott's Blade Runner — a box office flop that becomes the definitive sci-fi noir." },
  { date: "1984-10-26", label: "THE TERMINATOR", description: "James Cameron's The Terminator — 'I'll be back.' A franchise is born." },
  { date: "1985-07-03", label: "BACK TO THE FUTURE", description: "Back to the Future premieres — the perfect blockbuster." },
  { date: "1986-07-18", label: "ALIENS", description: "Cameron's Aliens — the rare sequel that rivals the original in a completely different genre." },
  { date: "1987-07-17", label: "FULL METAL JACKET", description: "Kubrick's searing Vietnam War film — 'This is my rifle.'" },
  { date: "1988-07-15", label: "DIE HARD", description: "Die Hard redefines the action movie — 'Yippee-ki-yay.'" },
  { date: "1989-06-23", label: "BATMAN", description: "Tim Burton's Batman — the dark superhero blockbuster arrives." },

  // 1990s
  { date: "1990-09-19", label: "GOODFELLAS", description: "Scorsese's GoodFellas — the greatest mob film since The Godfather." },
  { date: "1991-02-14", label: "SILENCE OF THE LAMBS", description: "The Silence of the Lambs — Hopkins' Hannibal Lecter terrifies the world." },
  { date: "1991-07-03", label: "TERMINATOR 2", description: "T2: Judgment Day — groundbreaking CGI and the greatest action sequel ever." },
  { date: "1993-06-11", label: "JURASSIC PARK", description: "Spielberg's Jurassic Park — dinosaurs walk the earth again. VFX will never be the same." },
  { date: "1993-12-15", label: "SCHINDLER'S LIST", description: "Spielberg's Schindler's List — cinema at its most powerful and devastating." },
  { date: "1994-07-06", label: "FORREST GUMP", description: "Forrest Gump premieres — 'Life is like a box of chocolates.'" },
  { date: "1994-09-10", label: "SHAWSHANK REDEMPTION", description: "The Shawshank Redemption opens — a box office disappointment that becomes the most beloved film of all time." },
  { date: "1994-09-23", label: "PULP FICTION", description: "Tarantino's masterpiece hits US theaters." },
  { date: "1995-11-22", label: "TOY STORY", description: "Pixar's Toy Story — the first fully CGI animated feature changes everything." },
  { date: "1997-12-19", label: "TITANIC", description: "Cameron's Titanic premieres — becomes the highest-grossing film in history." },
  { date: "1999-03-31", label: "THE MATRIX", description: "The Matrix bends reality — 'There is no spoon.' Bullet time is born." },
  { date: "1999-05-19", label: "PHANTOM MENACE", description: "Star Wars: The Phantom Menace — the most hyped premiere in history." },
  { date: "1999-03-05", label: "FIGHT CLUB", description: "Fincher's Fight Club — a generation-defining cult classic. First rule..." },

  // 2000s
  { date: "2000-05-24", label: "GLADIATOR", description: "Ridley Scott's Gladiator — 'Are you not entertained?!' The sword-and-sandal epic returns." },
  { date: "2001-07-20", label: "SPIRITED AWAY", description: "Miyazaki's Spirited Away premieres — the masterpiece of animated cinema." },
  { date: "2001-12-19", label: "LORD OF THE RINGS", description: "The Fellowship of the Ring premieres — the greatest fantasy trilogy begins." },
  { date: "2003-12-17", label: "RETURN OF THE KING", description: "Return of the King — Jackson's trilogy ends. Sweeps 11 Oscars, tying the all-time record." },
  { date: "2004-06-11", label: "THE INCREDIBLES", description: "Pixar's The Incredibles — the best superhero family film ever made." },
  { date: "2005-06-15", label: "BATMAN BEGINS", description: "Nolan reboots Batman — the gritty superhero era begins." },
  { date: "2007-06-12", label: "NO COUNTRY FOR OLD MEN", description: "The Coen Brothers' No Country for Old Men premieres — Chigurh haunts your dreams." },
  { date: "2007-11-02", label: "THERE WILL BE BLOOD", description: "PTA's There Will Be Blood — Daniel Day-Lewis gives the performance of a lifetime. 'I drink your milkshake!'" },
  { date: "2008-07-18", label: "THE DARK KNIGHT", description: "Nolan's The Dark Knight — Heath Ledger's Joker becomes legend." },
  { date: "2008-05-02", label: "IRON MAN", description: "Iron Man launches the MCU — Robert Downey Jr. changes superhero cinema forever." },
  { date: "2009-12-18", label: "AVATAR", description: "Cameron's Avatar — $2.9 billion worldwide. 3D cinema's peak moment." },

  // 2010s
  { date: "2010-07-16", label: "INCEPTION", description: "Nolan's Inception — dreams within dreams. The spinning top never stops." },
  { date: "2012-05-04", label: "THE AVENGERS", description: "Marvel's The Avengers — the crossover event that proved the MCU model works." },
  { date: "2013-10-04", label: "GRAVITY", description: "Cuarón's Gravity — Sandra Bullock alone in space. Redefines what IMAX can do." },
  { date: "2014-11-07", label: "INTERSTELLAR", description: "Nolan's Interstellar — love transcends dimensions. The docking scene is peak cinema." },
  { date: "2015-05-15", label: "MAD MAX: FURY ROAD", description: "George Miller's Fury Road — a 70-year-old director makes the greatest action film ever." },
  { date: "2015-12-18", label: "THE FORCE AWAKENS", description: "Star Wars: The Force Awakens — the saga returns. $2 billion worldwide." },
  { date: "2016-02-26", label: "GET OUT", description: "Jordan Peele's Get Out — horror as social commentary. A directorial debut for the ages." },
  { date: "2017-11-03", label: "BLADE RUNNER 2049", description: "Villeneuve's Blade Runner 2049 — a visually staggering sequel 35 years in the making." },
  { date: "2018-02-16", label: "BLACK PANTHER", description: "Black Panther — a cultural phenomenon. Wakanda forever." },
  { date: "2018-04-27", label: "INFINITY WAR", description: "Avengers: Infinity War — 'Mr. Stark, I don't feel so good.' The snap heard around the world." },
  { date: "2019-04-26", label: "ENDGAME", description: "Avengers: Endgame — the most anticipated film ever made." },
  { date: "2019-10-04", label: "JOKER", description: "Todd Phillips' Joker — Joaquin Phoenix descends into madness. $1B on an R-rated character study." },
  { date: "2019-11-11", label: "PARASITE", description: "Bong Joon-ho's Parasite — first non-English film to win Best Picture at the Oscars." },

  // 2020s
  { date: "2021-10-22", label: "DUNE", description: "Villeneuve's Dune — the 'unfilmable' book finally gets the epic it deserves." },
  { date: "2022-05-27", label: "TOP GUN: MAVERICK", description: "Top Gun: Maverick — Tom Cruise defies aging and gravity. $1.5B and the best legacy sequel ever." },
  { date: "2022-03-11", label: "EVERYTHING EVERYWHERE", description: "Everything Everywhere All at Once — a multiverse masterpiece on a shoestring budget. Sweeps the Oscars." },
  { date: "2023-07-21", label: "BARBIEHEIMER", description: "Barbie & Oppenheimer release on the same day — a cultural event." },
];

export function getHighlightForDate(month: number, day: number): HighlightEvent | undefined {
  return highlights.find((h) => {
    const d = new Date(h.date);
    return d.getMonth() + 1 === month && d.getDate() === day;
  });
}

export function getHighlightsForMonth(month: number): HighlightEvent[] {
  return highlights.filter((h) => {
    const d = new Date(h.date);
    return d.getMonth() + 1 === month;
  });
}
