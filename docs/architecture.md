# Arhitectură

## Module

### Fondul de Modernizare

Orientat pe operațiuni MySMIS:

- acțiuni de platformă
- cereri de rambursare
- cereri de prefinanțare
- acte adiționale obligatorii pentru TVA 19% -> 21%
- observații pe proiect

### PNRR / REPowerEU

Orientat pe clarificări:

- proiect + RUE
- componentă A/B
- termen răspuns
- prioritate
- status
- dată transmitere
- observații

## Model comun

`companies` și `projects` sunt comune. Entitățile operaționale sunt separate:

- `pnrr_clarifications`
- `fm_actions`
- `fm_addenda`

Această separare evită transformarea produsului într-un CRUD generic.
