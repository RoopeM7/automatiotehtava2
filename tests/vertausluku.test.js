import laskeVertausluvut from "../vertausluku.js";
import ehdokasRekisteri from "../ehdokasRekisteri.js";

import { afterEach, beforeEach, describe, it, mock } from "node:test";
import assert from "node:assert/strict";

describe("laskeVertausluvut", () => {
  beforeEach(() => {
    const lista = [
      { numero: 101, nimi: "Maija Meikäläinen", aanet: 1 },
      { numero: 102, nimi: "Kalle Korhonen", aanet: 4 },
      { numero: 103, nimi: "Sari Virtanen", aanet: 2 },
      { numero: 104, nimi: "Jukka Jokinen", aanet: 5 },
    ];

    mock.method(ehdokasRekisteri, "haeLista", () => {
      return lista;
    });
  });
  afterEach(() => {
    mock.reset(ehdokasRekisteri.haeLista);
  });
  it("listan eniten ääniä saaneen ehdokkaan vertausluku on listan äänten summa", () => {
    const tulos = laskeVertausluvut(ehdokasRekisteri.haeLista(1));
    assert.equal(tulos[0].vertausluku, 12);
  });
  it("listan toiseksi eniten ääniä saaneen ehdokkaan vertausluku on puolet listan äänien summasta", () => {
    const tulos = laskeVertausluvut(ehdokasRekisteri.haeLista(1));
    assert.equal(tulos[1].vertausluku, 6);
  });
  it("arpoo saman äänimäärän saaneiden järjestyksen ja merkitsee arvo: TRUE", () => {
    const lista = [
      { numero: 201, nimi: "Testi Eka", aanet: 3 },
      { numero: 202, nimi: "Testi Toka", aanet: 3 },
      { numero: 203, nimi: "Testi Kolmas", aanet: 1 },
    ];
    mock.method(ehdokasRekisteri, "haeLista", () => lista);
    const tulos = laskeVertausluvut(ehdokasRekisteri.haeLista(1));
    const kolmeAaninen = tulos.filter((e) => e.aanet === 3);
    assert.strictEqual(kolmeAaninen.length, 2);
    kolmeAaninen.forEach((ehdokas) => {
      assert.strictEqual(ehdokas.arvottu, true);
    });
    mock.reset(ehdokasRekisteri.haeLista);
  });
  it("arpoo saman äänimäärän ehdokkaiden järjestyksen ja lisää arvottu-kentän", () => {
    const lista = [
      { numero: 201, nimi: "Ehdokas A", aanet: 3 },
      { numero: 202, nimi: "Ehdokas B", aanet: 3 },
      { numero: 203, nimi: "Ehdokas C", aanet: 2 },
    ];
    const jarjestykset = new Set();
    for (let i = 0; i < 10; i++) {
      const tulos = laskeVertausluvut(lista);
      const samanAanimaaraEhdokkaat = tulos.filter((e) => e.aanet === 3);

      samanAanimaaraEhdokkaat.forEach((ehdokas) => {
        assert.equal(ehdokas.arvottu, true);
      });
      jarjestykset.add(samanAanimaaraEhdokkaat.map((e) => e.numero).join(","));
    }
    assert.ok(
      jarjestykset.size > 1,
      "Saman äänimäärän ehdokkaiden järjestys ei vaihtele"
    );
  });
});
