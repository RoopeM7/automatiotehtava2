/**
 * Laskee D'Hondtin vertausluvut yhdelle listalle
 * @param {Object[]} ehdokkaat - Taulukko ehdokasobjekteja, joissa numero, nimi ja äänimäärä
 * @returns {Object[]} - Sama taulukko, mutta lisättynä vertausluvuilla
 */
function laskeVertausluvut(ehdokkaat) {
  // Järjestetään ehdokkaat äänimäärän mukaan laskevasti
  const jarjestetyt = [...ehdokkaat].sort((a, b) => b.aanet - a.aanet);
  const arvottuJarjestys = jarjestetyt.reduce((result, ehdokas) => {
    const viimeinen = result[result.length - 1];
    if (viimeinen && viimeinen[0].aanet === ehdokas.aanet) {
      viimeinen.push(ehdokas);
    } else {
      result.push([ehdokas]);
    }

    return result;
  }, []);
  arvottuJarjestys.forEach((ryhma) => {
    if (ryhma.length > 1) {
      ryhma.sort(() => Math.random() - 0.5);
    }
  });

  const arvottuEhdokkaat = arvottuJarjestys.flat().map((ehdokas, index) => ({
    ...ehdokas,
    arvottu: ehdokas.arvottu !== undefined ? ehdokas.arvottu : true,
  }));

  const aanetYhteensa = arvottuEhdokkaat.reduce(
    (summa, ehdokas) => summa + ehdokas.aanet,
    0
  );

  return arvottuEhdokkaat.map((ehdokas, index) => ({
    ...ehdokas,
    vertausluku: aanetYhteensa / (index + 1),
  }));
}

export default laskeVertausluvut;
export { laskeVertausluvut };
