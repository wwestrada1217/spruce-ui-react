/**
 * Country flag icons — simplified SVG flags for all UN member states + key entities.
 * Named using ISO 3166-1 alpha-2 codes prefixed with "flag-".
 * All flags use a 24×24 viewBox with fill-based shapes.
 */
export const FLAG_ICONS: Record<string, string> = {
  // ── A ──────────────────────────────────────────────────────────────
  // Afghanistan — black / red / green vertical tricolor
  'flag-af':
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><rect width="8" height="24" fill="#000"/><rect x="8" width="8" height="24" fill="#BE0000"/><rect x="16" width="8" height="24" fill="#007A36"/><circle cx="12" cy="12" r="2.5" fill="none" stroke="#FFF" stroke-width=".5"/><rect width="24" height="24" fill="none" stroke="#000" stroke-opacity=".1" stroke-width=".5"/></svg>',
  // Albania — red with black double-headed eagle
  'flag-al':
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><rect width="24" height="24" fill="#E41E20"/><path d="M12 6c-1 0-2.6 1.2-3.5 2.5-.6.8-.5 1.5-.5 2l1 1.5-.5 1 1 2h1l.5 1h2l.5-1h1l1-2-.5-1 1-1.5c0-.5.1-1.2-.5-2C14.6 7.2 13 6 12 6z" fill="#000"/><rect width="24" height="24" fill="none" stroke="#000" stroke-opacity=".1" stroke-width=".5"/></svg>',
  // Algeria — green / white vertical with red crescent and star
  'flag-dz':
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><rect width="12" height="24" fill="#006233"/><rect x="12" width="12" height="24" fill="#FFF"/><circle cx="12.5" cy="12" r="3.5" fill="#D21034"/><circle cx="13.2" cy="12" r="2.8" fill="#FFF"/><polygon points="14.5,12 13.7,10.6 15.2,11.4 13.5,11.4 15,10.6" fill="#D21034"/><rect width="24" height="24" fill="none" stroke="#000" stroke-opacity=".1" stroke-width=".5"/></svg>',
  // Andorra — blue / yellow / red vertical tricolor
  'flag-ad':
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><rect width="8" height="24" fill="#10069F"/><rect x="8" width="8" height="24" fill="#FEDD00"/><rect x="16" width="8" height="24" fill="#D50032"/><rect width="24" height="24" fill="none" stroke="#000" stroke-opacity=".1" stroke-width=".5"/></svg>',
  // Angola — red / black horizontal with yellow emblem
  'flag-ao':
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><rect width="24" height="12" fill="#CE1126"/><rect y="12" width="24" height="12" fill="#000"/><path d="M10 10l2 2 2-2" fill="none" stroke="#FFCE00" stroke-width=".8"/><circle cx="12" cy="13" r="2" fill="none" stroke="#FFCE00" stroke-width=".6"/><polygon points="12,8 12.3,8.9 13.2,8.9 12.5,9.4 12.7,10.3 12,9.8 11.3,10.3 11.5,9.4 10.8,8.9 11.7,8.9" fill="#FFCE00"/><rect width="24" height="24" fill="none" stroke="#000" stroke-opacity=".1" stroke-width=".5"/></svg>',
  // Antigua and Barbuda — red with black / blue / white inverted triangle and sun
  'flag-ag':
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><rect width="24" height="24" fill="#CE1126"/><polygon points="0,0 12,16 24,0" fill="#000"/><polygon points="1,0 12,14 23,0" fill="#0072C6"/><polygon points="2.5,0 12,12 21.5,0" fill="#FFF"/><polygon points="12,2 12.6,4.5 15,4.5 13,6 13.6,8.5 12,7 10.4,8.5 11,6 9,4.5 11.4,4.5" fill="#FCD116"/><rect width="24" height="24" fill="none" stroke="#000" stroke-opacity=".1" stroke-width=".5"/></svg>',
  // Argentina — light blue / white / light blue horizontal with sun
  'flag-ar':
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><rect width="24" height="8" fill="#74ACDF"/><rect y="8" width="24" height="8" fill="#FFF"/><rect y="16" width="24" height="8" fill="#74ACDF"/><circle cx="12" cy="12" r="1.8" fill="#F6B40E"/><rect width="24" height="24" fill="none" stroke="#000" stroke-opacity=".1" stroke-width=".5"/></svg>',
  // Armenia — red / blue / orange horizontal tricolor
  'flag-am':
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><rect width="24" height="8" fill="#D90012"/><rect y="8" width="24" height="8" fill="#0033A0"/><rect y="16" width="24" height="8" fill="#F2A800"/><rect width="24" height="24" fill="none" stroke="#000" stroke-opacity=".1" stroke-width=".5"/></svg>',
  // Australia — blue with Union Jack canton and stars
  'flag-au':
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><rect width="24" height="24" fill="#00008B"/><rect width="12" height="12" fill="#012169"/><path d="M0 0l12 12M12 0L0 12" stroke="#FFF" stroke-width="2"/><path d="M0 0l12 12M12 0L0 12" stroke="#C8102E" stroke-width="1"/><rect y="5" width="12" height="2" fill="#FFF"/><rect x="5" width="2" height="12" fill="#FFF"/><rect y="5.4" width="12" height="1.2" fill="#C8102E"/><rect x="5.4" width="1.2" height="12" fill="#C8102E"/><polygon points="6,18 6.3,17.1 7.1,17.1 6.4,16.6 6.7,15.8 6,16.3 5.3,15.8 5.6,16.6 4.9,17.1 5.7,17.1" fill="#FFF"/><polygon points="18,9 18.2,8.4 18.8,8.4 18.3,8 18.5,7.4 18,7.8 17.5,7.4 17.7,8 17.2,8.4 17.8,8.4" fill="#FFF"/><polygon points="20,14 20.2,13.4 20.8,13.4 20.3,13 20.5,12.4 20,12.8 19.5,12.4 19.7,13 19.2,13.4 19.8,13.4" fill="#FFF"/><polygon points="16,18 16.2,17.4 16.8,17.4 16.3,17 16.5,16.4 16,16.8 15.5,16.4 15.7,17 15.2,17.4 15.8,17.4" fill="#FFF"/><polygon points="18,20 18.2,19.4 18.8,19.4 18.3,19 18.5,18.4 18,18.8 17.5,18.4 17.7,19 17.2,19.4 17.8,19.4" fill="#FFF"/><rect width="24" height="24" fill="none" stroke="#000" stroke-opacity=".1" stroke-width=".5"/></svg>',
  // Austria — red / white / red horizontal tricolor
  'flag-at':
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><rect width="24" height="8" fill="#ED2939"/><rect y="8" width="24" height="8" fill="#FFF"/><rect y="16" width="24" height="8" fill="#ED2939"/><rect width="24" height="24" fill="none" stroke="#000" stroke-opacity=".1" stroke-width=".5"/></svg>',
  // Azerbaijan — blue / red / green horizontal with crescent and star
  'flag-az':
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><rect width="24" height="8" fill="#0092BC"/><rect y="8" width="24" height="8" fill="#E4002B"/><rect y="16" width="24" height="8" fill="#00B24D"/><circle cx="11" cy="12" r="2.5" fill="#FFF"/><circle cx="11.8" cy="12" r="2" fill="#E4002B"/><polygon points="14.5,12 14,11 15.2,11.7 13.8,11.7 15,11" fill="#FFF"/><rect width="24" height="24" fill="none" stroke="#000" stroke-opacity=".1" stroke-width=".5"/></svg>',

  // ── B ──────────────────────────────────────────────────────────────
  // Bahamas — aquamarine / gold / aquamarine with black triangle
  'flag-bs':
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><rect width="24" height="8" fill="#00778B"/><rect y="8" width="24" height="8" fill="#FFC72C"/><rect y="16" width="24" height="8" fill="#00778B"/><polygon points="0,0 10,12 0,24" fill="#000"/><rect width="24" height="24" fill="none" stroke="#000" stroke-opacity=".1" stroke-width=".5"/></svg>',
  // Bahrain — white / red with serrated edge
  'flag-bh':
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><rect width="24" height="24" fill="#CE1126"/><polygon points="0,0 8,0 10,2.4 8,4.8 10,7.2 8,9.6 10,12 8,14.4 10,16.8 8,19.2 10,21.6 8,24 0,24" fill="#FFF"/><rect width="24" height="24" fill="none" stroke="#000" stroke-opacity=".1" stroke-width=".5"/></svg>',
  // Bangladesh — green with red circle
  'flag-bd':
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><rect width="24" height="24" fill="#006A4E"/><circle cx="11" cy="12" r="4.5" fill="#F42A41"/><rect width="24" height="24" fill="none" stroke="#000" stroke-opacity=".1" stroke-width=".5"/></svg>',
  // Barbados — blue / gold / blue vertical with trident
  'flag-bb':
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><rect width="8" height="24" fill="#00267F"/><rect x="8" width="8" height="24" fill="#FFC726"/><rect x="16" width="8" height="24" fill="#00267F"/><path d="M12 6v12M10 8l2-2 2 2M10.5 7h3" fill="none" stroke="#000" stroke-width=".6"/><rect width="24" height="24" fill="none" stroke="#000" stroke-opacity=".1" stroke-width=".5"/></svg>',
  // Belarus — red / green horizontal with ornament
  'flag-by':
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><rect width="24" height="16" fill="#CF101A"/><rect y="16" width="24" height="8" fill="#007D2C"/><rect width="3" height="24" fill="#FFF"/><path d="M0 4h3M0 8h3M0 12h3M0 16h3M0 20h3" stroke="#CF101A" stroke-width=".8"/><rect width="24" height="24" fill="none" stroke="#000" stroke-opacity=".1" stroke-width=".5"/></svg>',
  // Belgium — black / yellow / red vertical tricolor
  'flag-be':
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><rect width="8" height="24" fill="#000"/><rect x="8" width="8" height="24" fill="#FAE042"/><rect x="16" width="8" height="24" fill="#ED2939"/><rect width="24" height="24" fill="none" stroke="#000" stroke-opacity=".1" stroke-width=".5"/></svg>',
  // Belize — blue with red stripes and circle
  'flag-bz':
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><rect width="24" height="24" fill="#003F87"/><rect width="24" height="3" fill="#CE1126"/><rect y="21" width="24" height="3" fill="#CE1126"/><circle cx="12" cy="12" r="4.5" fill="#FFF"/><circle cx="12" cy="12" r="3.5" fill="#006847"/><rect width="24" height="24" fill="none" stroke="#000" stroke-opacity=".1" stroke-width=".5"/></svg>',
  // Benin — green vertical bar, yellow / red horizontal
  'flag-bj':
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><rect width="9" height="24" fill="#008751"/><rect x="9" width="15" height="12" fill="#FCD116"/><rect x="9" y="12" width="15" height="12" fill="#E8112D"/><rect width="24" height="24" fill="none" stroke="#000" stroke-opacity=".1" stroke-width=".5"/></svg>',
  // Bhutan — yellow / orange diagonal with simplified dragon
  'flag-bt':
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><polygon points="0,0 24,0 0,24" fill="#FFD520"/><polygon points="24,0 24,24 0,24" fill="#FF4E12"/><circle cx="12" cy="12" r="3" fill="#FFF" fill-opacity=".3"/><rect width="24" height="24" fill="none" stroke="#000" stroke-opacity=".1" stroke-width=".5"/></svg>',
  // Bolivia — red / yellow / green horizontal tricolor
  'flag-bo':
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><rect width="24" height="8" fill="#D52B1E"/><rect y="8" width="24" height="8" fill="#F9E300"/><rect y="16" width="24" height="8" fill="#007934"/><rect width="24" height="24" fill="none" stroke="#000" stroke-opacity=".1" stroke-width=".5"/></svg>',
  // Bosnia and Herzegovina — blue with yellow triangle and stars
  'flag-ba':
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><rect width="24" height="24" fill="#002395"/><polygon points="6,0 24,24 24,0" fill="#FECB00"/><circle cx="9" cy="3" r=".7" fill="#FFF"/><circle cx="11" cy="6" r=".7" fill="#FFF"/><circle cx="13" cy="9" r=".7" fill="#FFF"/><circle cx="15" cy="12" r=".7" fill="#FFF"/><circle cx="17" cy="15" r=".7" fill="#FFF"/><circle cx="19" cy="18" r=".7" fill="#FFF"/><circle cx="21" cy="21" r=".7" fill="#FFF"/><rect width="24" height="24" fill="none" stroke="#000" stroke-opacity=".1" stroke-width=".5"/></svg>',
  // Botswana — light blue with black / white central stripe
  'flag-bw':
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><rect width="24" height="24" fill="#75AADB"/><rect y="9" width="24" height="1" fill="#FFF"/><rect y="10" width="24" height="4" fill="#000"/><rect y="14" width="24" height="1" fill="#FFF"/><rect width="24" height="24" fill="none" stroke="#000" stroke-opacity=".1" stroke-width=".5"/></svg>',
  // Brazil — green with yellow diamond and blue circle
  'flag-br':
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><rect width="24" height="24" fill="#009B3A"/><polygon points="12,3 22,12 12,21 2,12" fill="#FEDF00"/><circle cx="12" cy="12" r="4" fill="#002776"/><path d="M8 13.5q4-2 8 0" fill="none" stroke="#FFF" stroke-width=".5"/><rect width="24" height="24" fill="none" stroke="#000" stroke-opacity=".1" stroke-width=".5"/></svg>',
  // Brunei — yellow with black / white diagonal and red emblem
  'flag-bn':
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><rect width="24" height="24" fill="#F7E017"/><polygon points="0,7 24,3 24,10 0,14" fill="#FFF"/><polygon points="0,8 24,4 24,9 0,13" fill="#000"/><circle cx="12" cy="12" r="2.5" fill="#CF1126" fill-opacity=".3"/><rect width="24" height="24" fill="none" stroke="#000" stroke-opacity=".1" stroke-width=".5"/></svg>',
  // Bulgaria — white / green / red horizontal tricolor
  'flag-bg':
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><rect width="24" height="8" fill="#FFF"/><rect y="8" width="24" height="8" fill="#00966E"/><rect y="16" width="24" height="8" fill="#D62612"/><rect width="24" height="24" fill="none" stroke="#000" stroke-opacity=".1" stroke-width=".5"/></svg>',
  // Burkina Faso — red / green horizontal with yellow star
  'flag-bf':
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><rect width="24" height="12" fill="#EF2B2D"/><rect y="12" width="24" height="12" fill="#009E49"/><polygon points="12,9 12.6,11 14.5,11 13,12.2 13.5,14 12,12.8 10.5,14 11,12.2 9.5,11 11.4,11" fill="#FCD116"/><rect width="24" height="24" fill="none" stroke="#000" stroke-opacity=".1" stroke-width=".5"/></svg>',
  // Burundi — white saltire with red / green quadrants, circle with stars
  'flag-bi':
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><rect width="24" height="24" fill="#FFF"/><polygon points="0,0 10,12 0,24" fill="#18B637"/><polygon points="24,0 14,12 24,24" fill="#18B637"/><polygon points="0,0 12,10 24,0" fill="#CE1126"/><polygon points="0,24 12,14 24,24" fill="#CE1126"/><circle cx="12" cy="12" r="3.5" fill="#FFF"/><circle cx="12" cy="12" r="3.5" fill="none" stroke="#18B637" stroke-width=".3"/><circle cx="12" cy="9.5" r=".6" fill="#CE1126"/><circle cx="10" cy="13" r=".6" fill="#CE1126"/><circle cx="14" cy="13" r=".6" fill="#CE1126"/><rect width="24" height="24" fill="none" stroke="#000" stroke-opacity=".1" stroke-width=".5"/></svg>',

  // ── C ──────────────────────────────────────────────────────────────
  // Cabo Verde — blue with red / white stripes and yellow stars
  'flag-cv':
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><rect width="24" height="24" fill="#003893"/><rect y="13" width="24" height="1.5" fill="#FFF"/><rect y="14.5" width="24" height="2" fill="#CF2027"/><rect y="16.5" width="24" height="1.5" fill="#FFF"/><circle cx="8" cy="16" r="3.5" fill="none"/><polygon points="6,15.5 6.2,14.8 6.8,14.8 6.3,14.5 6.5,13.8 6,14.2 5.5,13.8 5.7,14.5 5.2,14.8 5.8,14.8" fill="#F7D116"/><polygon points="10,15.5 10.2,14.8 10.8,14.8 10.3,14.5 10.5,13.8 10,14.2 9.5,13.8 9.7,14.5 9.2,14.8 9.8,14.8" fill="#F7D116"/><polygon points="8,19 8.2,18.3 8.8,18.3 8.3,18 8.5,17.3 8,17.7 7.5,17.3 7.7,18 7.2,18.3 7.8,18.3" fill="#F7D116"/><rect width="24" height="24" fill="none" stroke="#000" stroke-opacity=".1" stroke-width=".5"/></svg>',
  // Cambodia — blue / red / blue horizontal with white temple
  'flag-kh':
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><rect width="24" height="6" fill="#032EA1"/><rect y="6" width="24" height="12" fill="#E00025"/><rect y="18" width="24" height="6" fill="#032EA1"/><rect x="9" y="9" width="6" height="6" fill="#FFF"/><rect x="10" y="10" width="4" height="5" fill="#FFF"/><path d="M10 15v-4h1v-1h2v1h1v4" fill="none" stroke="#FFF" stroke-width=".5"/><rect width="24" height="24" fill="none" stroke="#000" stroke-opacity=".1" stroke-width=".5"/></svg>',
  // Cameroon — green / red / yellow vertical with star
  'flag-cm':
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><rect width="8" height="24" fill="#007A5E"/><rect x="8" width="8" height="24" fill="#CE1126"/><rect x="16" width="8" height="24" fill="#FCD116"/><polygon points="12,9 12.5,10.5 14,10.5 12.8,11.5 13.2,13 12,12 10.8,13 11.2,11.5 10,10.5 11.5,10.5" fill="#FCD116"/><rect width="24" height="24" fill="none" stroke="#000" stroke-opacity=".1" stroke-width=".5"/></svg>',
  // Canada — red / white / red vertical with maple leaf
  'flag-ca':
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><rect width="6" height="24" fill="#FF0000"/><rect x="6" width="12" height="24" fill="#FFF"/><rect x="18" width="6" height="24" fill="#FF0000"/><path d="M12 7l-1 3-3-1 1.5 3L7 13h3l-.5 3h5l-.5-3h3l-2.5-1 1.5-3-3 1z" fill="#FF0000"/><rect width="24" height="24" fill="none" stroke="#000" stroke-opacity=".1" stroke-width=".5"/></svg>',
  // Central African Republic — blue / white / green / yellow horizontal, red vertical, star
  'flag-cf':
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><rect width="24" height="6" fill="#003082"/><rect y="6" width="24" height="6" fill="#FFF"/><rect y="12" width="24" height="6" fill="#289611"/><rect y="18" width="24" height="6" fill="#FFCE00"/><rect x="10" width="4" height="24" fill="#D21034"/><polygon points="3,1 3.3,2 4.2,2 3.5,2.5 3.7,3.5 3,3 2.3,3.5 2.5,2.5 1.8,2 2.7,2" fill="#FFCE00"/><rect width="24" height="24" fill="none" stroke="#000" stroke-opacity=".1" stroke-width=".5"/></svg>',
  // Chad — blue / yellow / red vertical tricolor
  'flag-td':
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><rect width="8" height="24" fill="#002664"/><rect x="8" width="8" height="24" fill="#FECB00"/><rect x="16" width="8" height="24" fill="#C60C30"/><rect width="24" height="24" fill="none" stroke="#000" stroke-opacity=".1" stroke-width=".5"/></svg>',
  // Chile — white top / red bottom with blue canton and star
  'flag-cl':
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><rect width="24" height="12" fill="#FFF"/><rect y="12" width="24" height="12" fill="#D52B1E"/><rect width="8" height="12" fill="#0039A6"/><polygon points="4,4 4.4,5.2 5.6,5.2 4.6,5.9 5,7.2 4,6.4 3,7.2 3.4,5.9 2.4,5.2 3.6,5.2" fill="#FFF"/><rect width="24" height="24" fill="none" stroke="#000" stroke-opacity=".1" stroke-width=".5"/></svg>',
  // China — red with yellow stars
  'flag-cn':
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><rect width="24" height="24" fill="#DE2910"/><polygon points="5,4 5.6,5.8 7.5,5.8 6,6.9 6.5,8.7 5,7.5 3.5,8.7 4,6.9 2.5,5.8 4.4,5.8" fill="#FFDE00"/><polygon points="10,2 10.3,2.7 11,2.7 10.4,3.1 10.6,3.8 10,3.4 9.4,3.8 9.6,3.1 9,2.7 9.7,2.7" fill="#FFDE00"/><polygon points="12,4 12.3,4.7 13,4.7 12.4,5.1 12.6,5.8 12,5.4 11.4,5.8 11.6,5.1 11,4.7 11.7,4.7" fill="#FFDE00"/><polygon points="12,7 12.3,7.7 13,7.7 12.4,8.1 12.6,8.8 12,8.4 11.4,8.8 11.6,8.1 11,7.7 11.7,7.7" fill="#FFDE00"/><polygon points="10,9 10.3,9.7 11,9.7 10.4,10.1 10.6,10.8 10,10.4 9.4,10.8 9.6,10.1 9,9.7 9.7,9.7" fill="#FFDE00"/><rect width="24" height="24" fill="none" stroke="#000" stroke-opacity=".1" stroke-width=".5"/></svg>',
  // Colombia — yellow / blue / red horizontal (yellow takes half)
  'flag-co':
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><rect width="24" height="12" fill="#FCD116"/><rect y="12" width="24" height="6" fill="#003893"/><rect y="18" width="24" height="6" fill="#CE1126"/><rect width="24" height="24" fill="none" stroke="#000" stroke-opacity=".1" stroke-width=".5"/></svg>',
  // Comoros — green with crescent and 4 stars, horizontal stripes
  'flag-km':
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><rect width="24" height="6" fill="#FFC61E"/><rect y="6" width="24" height="6" fill="#FFF"/><rect y="12" width="24" height="6" fill="#CE1126"/><rect y="18" width="24" height="6" fill="#3A75C4"/><polygon points="0,0 10,12 0,24" fill="#3D8E33"/><circle cx="4" cy="11" r="2.5" fill="#FFF"/><circle cx="5" cy="11" r="2" fill="#3D8E33"/><rect width="24" height="24" fill="none" stroke="#000" stroke-opacity=".1" stroke-width=".5"/></svg>',
  // Congo Republic — green / yellow / red diagonal
  'flag-cg':
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><rect width="24" height="24" fill="#009543"/><polygon points="0,24 24,0 24,24" fill="#CE1126"/><polygon points="0,16 16,0 24,0 24,8 8,24 0,24" fill="#FBDE4A"/><rect width="24" height="24" fill="none" stroke="#000" stroke-opacity=".1" stroke-width=".5"/></svg>',
  // DR Congo — blue with red diagonal and yellow star
  'flag-cd':
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><rect width="24" height="24" fill="#007FFF"/><path d="M0,24L24,6" stroke="#FFCE00" stroke-width="1.5"/><path d="M0,24L24,6" stroke="#CE1126" stroke-width="4"/><path d="M0,24L24,6" stroke="#FFCE00" stroke-width="1.5"/><polygon points="4,3 4.4,4.2 5.6,4.2 4.6,5 5,6.2 4,5.4 3,6.2 3.4,5 2.4,4.2 3.6,4.2" fill="#FFCE00"/><rect width="24" height="24" fill="none" stroke="#000" stroke-opacity=".1" stroke-width=".5"/></svg>',
  // Costa Rica — blue / white / red / white / blue horizontal
  'flag-cr':
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><rect width="24" height="4" fill="#002B7F"/><rect y="4" width="24" height="3" fill="#FFF"/><rect y="7" width="24" height="10" fill="#CE1126"/><rect y="17" width="24" height="3" fill="#FFF"/><rect y="20" width="24" height="4" fill="#002B7F"/><rect width="24" height="24" fill="none" stroke="#000" stroke-opacity=".1" stroke-width=".5"/></svg>',
  // Côte d'Ivoire — orange / white / green vertical tricolor
  'flag-ci':
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><rect width="8" height="24" fill="#F77F00"/><rect x="8" width="8" height="24" fill="#FFF"/><rect x="16" width="8" height="24" fill="#009E60"/><rect width="24" height="24" fill="none" stroke="#000" stroke-opacity=".1" stroke-width=".5"/></svg>',
  // Croatia — red / white / blue horizontal with checkerboard
  'flag-hr':
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><rect width="24" height="8" fill="#FF0000"/><rect y="8" width="24" height="8" fill="#FFF"/><rect y="16" width="24" height="8" fill="#171796"/><rect x="9" y="5" width="6" height="7" fill="#FFF" stroke="#000" stroke-width=".2"/><rect x="9" y="5" width="1.2" height="1.4" fill="#FF0000"/><rect x="11.4" y="5" width="1.2" height="1.4" fill="#FF0000"/><rect x="13.8" y="5" width="1.2" height="1.4" fill="#FF0000"/><rect x="10.2" y="6.4" width="1.2" height="1.4" fill="#FF0000"/><rect x="12.6" y="6.4" width="1.2" height="1.4" fill="#FF0000"/><rect x="9" y="7.8" width="1.2" height="1.4" fill="#FF0000"/><rect x="11.4" y="7.8" width="1.2" height="1.4" fill="#FF0000"/><rect x="13.8" y="7.8" width="1.2" height="1.4" fill="#FF0000"/><rect width="24" height="24" fill="none" stroke="#000" stroke-opacity=".1" stroke-width=".5"/></svg>',
  // Cuba — blue / white stripes with red triangle and star
  'flag-cu':
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><rect width="24" height="4.8" fill="#002A8F"/><rect y="4.8" width="24" height="4.8" fill="#FFF"/><rect y="9.6" width="24" height="4.8" fill="#002A8F"/><rect y="14.4" width="24" height="4.8" fill="#FFF"/><rect y="19.2" width="24" height="4.8" fill="#002A8F"/><polygon points="0,0 12,12 0,24" fill="#CB1515"/><polygon points="4,10 4.4,11.2 5.6,11.2 4.6,12 5,13.2 4,12.4 3,13.2 3.4,12 2.4,11.2 3.6,11.2" fill="#FFF"/><rect width="24" height="24" fill="none" stroke="#000" stroke-opacity=".1" stroke-width=".5"/></svg>',
  // Cyprus — white with copper island and olive branches
  'flag-cy':
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><rect width="24" height="24" fill="#FFF"/><ellipse cx="12" cy="10" rx="5" ry="2.5" fill="#D57800"/><path d="M8 16q2-1 4 0t4-1" fill="none" stroke="#4E7F3E" stroke-width=".6"/><path d="M8 17q2-1 4 0t4-1" fill="none" stroke="#4E7F3E" stroke-width=".6"/><rect width="24" height="24" fill="none" stroke="#000" stroke-opacity=".1" stroke-width=".5"/></svg>',
  // Czech Republic — white / red with blue triangle
  'flag-cz':
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><rect width="24" height="12" fill="#FFF"/><rect y="12" width="24" height="12" fill="#D7141A"/><polygon points="0,0 12,12 0,24" fill="#11457E"/><rect width="24" height="24" fill="none" stroke="#000" stroke-opacity=".1" stroke-width=".5"/></svg>',

  // ── D ──────────────────────────────────────────────────────────────
  // Denmark — red with white Scandinavian cross
  'flag-dk':
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><rect width="24" height="24" fill="#C60C30"/><rect y="10" width="24" height="4" fill="#FFF"/><rect x="7" width="3" height="24" fill="#FFF"/><rect width="24" height="24" fill="none" stroke="#000" stroke-opacity=".1" stroke-width=".5"/></svg>',
  // Djibouti — light blue / green with white triangle and red star
  'flag-dj':
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><rect width="24" height="12" fill="#6AB2E7"/><rect y="12" width="24" height="12" fill="#12AD2B"/><polygon points="0,0 12,12 0,24" fill="#FFF"/><polygon points="4,10 4.4,11 5.3,11 4.5,11.6 4.8,12.5 4,12 3.2,12.5 3.5,11.6 2.7,11 3.6,11" fill="#D7141A"/><rect width="24" height="24" fill="none" stroke="#000" stroke-opacity=".1" stroke-width=".5"/></svg>',
  // Dominica — green with cross and purple parrot circle
  'flag-dm':
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><rect width="24" height="24" fill="#006B3F"/><rect y="10" width="24" height="4" fill="#000"/><rect y="9" width="24" height="1" fill="#FCD116"/><rect y="14" width="24" height="1" fill="#FFF"/><rect x="7" width="3" height="24" fill="#000"/><rect x="6" width="1" height="24" fill="#FCD116"/><rect x="10" width="1" height="24" fill="#FFF"/><circle cx="12" cy="12" r="3" fill="#D41C30"/><rect width="24" height="24" fill="none" stroke="#000" stroke-opacity=".1" stroke-width=".5"/></svg>',
  // Dominican Republic — quartered blue / red with white cross
  'flag-do':
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><rect width="12" height="12" fill="#002D62"/><rect x="12" width="12" height="12" fill="#CE1126"/><rect y="12" width="12" height="12" fill="#CE1126"/><rect x="12" y="12" width="12" height="12" fill="#002D62"/><rect y="10.5" width="24" height="3" fill="#FFF"/><rect x="10.5" width="3" height="24" fill="#FFF"/><rect width="24" height="24" fill="none" stroke="#000" stroke-opacity=".1" stroke-width=".5"/></svg>',

  // ── E ──────────────────────────────────────────────────────────────
  // Ecuador — yellow / blue / red horizontal (yellow half)
  'flag-ec':
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><rect width="24" height="12" fill="#FFD100"/><rect y="12" width="24" height="6" fill="#0033A0"/><rect y="18" width="24" height="6" fill="#CE1126"/><rect width="24" height="24" fill="none" stroke="#000" stroke-opacity=".1" stroke-width=".5"/></svg>',
  // Egypt — red / white / black horizontal with golden eagle
  'flag-eg':
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><rect width="24" height="8" fill="#CE1126"/><rect y="8" width="24" height="8" fill="#FFF"/><rect y="16" width="24" height="8" fill="#000"/><path d="M11 10v3h2v-3l1-1h-4z" fill="#C09300"/><rect width="24" height="24" fill="none" stroke="#000" stroke-opacity=".1" stroke-width=".5"/></svg>',
  // El Salvador — blue / white / blue horizontal
  'flag-sv':
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><rect width="24" height="8" fill="#0F47AF"/><rect y="8" width="24" height="8" fill="#FFF"/><rect y="16" width="24" height="8" fill="#0F47AF"/><rect width="24" height="24" fill="none" stroke="#000" stroke-opacity=".1" stroke-width=".5"/></svg>',
  // Equatorial Guinea — green / white / red horizontal with blue triangle
  'flag-gq':
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><rect width="24" height="8" fill="#3E9A00"/><rect y="8" width="24" height="8" fill="#FFF"/><rect y="16" width="24" height="8" fill="#E32118"/><polygon points="0,0 8,12 0,24" fill="#0073CE"/><rect width="24" height="24" fill="none" stroke="#000" stroke-opacity=".1" stroke-width=".5"/></svg>',
  // Eritrea — red triangle with green / blue and yellow olive branch
  'flag-er':
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><polygon points="0,0 24,0 24,12 0,12" fill="#4189DD"/><polygon points="0,12 24,12 24,24 0,24" fill="#12AD2B"/><polygon points="0,0 24,12 0,24" fill="#EA0437"/><circle cx="7" cy="12" r="3" fill="#F3C63A" fill-opacity=".4"/><rect width="24" height="24" fill="none" stroke="#000" stroke-opacity=".1" stroke-width=".5"/></svg>',
  // Estonia — blue / black / white horizontal tricolor
  'flag-ee':
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><rect width="24" height="8" fill="#0072CE"/><rect y="8" width="24" height="8" fill="#000"/><rect y="16" width="24" height="8" fill="#FFF"/><rect width="24" height="24" fill="none" stroke="#000" stroke-opacity=".1" stroke-width=".5"/></svg>',
  // Eswatini — blue / yellow / red horizontal with shield
  'flag-sz':
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><rect width="24" height="5" fill="#3E5EB9"/><rect y="5" width="24" height="2" fill="#FED100"/><rect y="7" width="24" height="10" fill="#B10C0C"/><rect y="17" width="24" height="2" fill="#FED100"/><rect y="19" width="24" height="5" fill="#3E5EB9"/><ellipse cx="12" cy="12" rx="4" ry="3" fill="#000" stroke="#FFF" stroke-width=".5"/><rect width="24" height="24" fill="none" stroke="#000" stroke-opacity=".1" stroke-width=".5"/></svg>',
  // Ethiopia — green / yellow / red horizontal with blue circle and star
  'flag-et':
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><rect width="24" height="8" fill="#078930"/><rect y="8" width="24" height="8" fill="#FCDD09"/><rect y="16" width="24" height="8" fill="#DA121A"/><circle cx="12" cy="12" r="3.5" fill="#0F47AF"/><polygon points="12,9.5 12.5,11 14,11 12.8,12 13.2,13.5 12,12.5 10.8,13.5 11.2,12 10,11 11.5,11" fill="#FCDD09"/><rect width="24" height="24" fill="none" stroke="#000" stroke-opacity=".1" stroke-width=".5"/></svg>',

  // ── F ──────────────────────────────────────────────────────────────
  // Fiji — light blue with Union Jack canton and shield
  'flag-fj':
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><rect width="24" height="24" fill="#68BFE5"/><rect width="12" height="12" fill="#012169"/><path d="M0 0l12 12M12 0L0 12" stroke="#FFF" stroke-width="2"/><path d="M0 0l12 12M12 0L0 12" stroke="#C8102E" stroke-width="1"/><rect y="5" width="12" height="2" fill="#FFF"/><rect x="5" width="2" height="12" fill="#FFF"/><rect y="5.4" width="12" height="1.2" fill="#C8102E"/><rect x="5.4" width="1.2" height="12" fill="#C8102E"/><rect x="16" y="8" width="5" height="8" rx="1" fill="#FFF"/><rect x="16" y="8" width="5" height="4" rx="1" fill="#C8102E"/><rect width="24" height="24" fill="none" stroke="#000" stroke-opacity=".1" stroke-width=".5"/></svg>',
  // Finland — white with blue Scandinavian cross
  'flag-fi':
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><rect width="24" height="24" fill="#FFF"/><rect y="10" width="24" height="4" fill="#002F6C"/><rect x="7" width="3" height="24" fill="#002F6C"/><rect width="24" height="24" fill="none" stroke="#000" stroke-opacity=".1" stroke-width=".5"/></svg>',
  // France — blue / white / red vertical tricolor
  'flag-fr':
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><rect width="8" height="24" fill="#002395"/><rect x="8" width="8" height="24" fill="#FFF"/><rect x="16" width="8" height="24" fill="#ED2939"/><rect width="24" height="24" fill="none" stroke="#000" stroke-opacity=".1" stroke-width=".5"/></svg>',

  // ── G ──────────────────────────────────────────────────────────────
  // Gabon — green / yellow / blue horizontal tricolor
  'flag-ga':
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><rect width="24" height="8" fill="#009E49"/><rect y="8" width="24" height="8" fill="#FCD116"/><rect y="16" width="24" height="8" fill="#3A75C4"/><rect width="24" height="24" fill="none" stroke="#000" stroke-opacity=".1" stroke-width=".5"/></svg>',
  // Gambia — red / blue / green horizontal with white stripes
  'flag-gm':
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><rect width="24" height="8" fill="#CE1126"/><rect y="8" width="24" height="1" fill="#FFF"/><rect y="9" width="24" height="6" fill="#0C1C8C"/><rect y="15" width="24" height="1" fill="#FFF"/><rect y="16" width="24" height="8" fill="#3A7728"/><rect width="24" height="24" fill="none" stroke="#000" stroke-opacity=".1" stroke-width=".5"/></svg>',
  // Georgia — white with red cross and 4 small crosses
  'flag-ge':
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><rect width="24" height="24" fill="#FFF"/><rect y="10" width="24" height="4" fill="#FF0000"/><rect x="10" width="4" height="24" fill="#FF0000"/><rect x="4" y="4" width="2" height=".5" fill="#FF0000"/><rect x="4.75" y="3" width=".5" height="2.5" fill="#FF0000"/><rect x="18" y="4" width="2" height=".5" fill="#FF0000"/><rect x="18.75" y="3" width=".5" height="2.5" fill="#FF0000"/><rect x="4" y="18" width="2" height=".5" fill="#FF0000"/><rect x="4.75" y="17" width=".5" height="2.5" fill="#FF0000"/><rect x="18" y="18" width="2" height=".5" fill="#FF0000"/><rect x="18.75" y="17" width=".5" height="2.5" fill="#FF0000"/><rect width="24" height="24" fill="none" stroke="#000" stroke-opacity=".1" stroke-width=".5"/></svg>',
  // Germany — black / red / gold horizontal tricolor
  'flag-de':
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><rect width="24" height="8" fill="#000"/><rect y="8" width="24" height="8" fill="#DD0000"/><rect y="16" width="24" height="8" fill="#FFCC00"/><rect width="24" height="24" fill="none" stroke="#000" stroke-opacity=".1" stroke-width=".5"/></svg>',
  // Ghana — red / gold / green horizontal with black star
  'flag-gh':
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><rect width="24" height="8" fill="#CE1126"/><rect y="8" width="24" height="8" fill="#FCD116"/><rect y="16" width="24" height="8" fill="#006B3F"/><polygon points="12,9 12.5,10.5 14,10.5 12.8,11.5 13.2,13 12,12 10.8,13 11.2,11.5 10,10.5 11.5,10.5" fill="#000"/><rect width="24" height="24" fill="none" stroke="#000" stroke-opacity=".1" stroke-width=".5"/></svg>',
  // Greece — blue / white stripes with blue canton and cross
  'flag-gr':
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><rect width="24" height="24" fill="#0D5EAF"/><rect y="2.67" width="24" height="2.67" fill="#FFF"/><rect y="8" width="24" height="2.67" fill="#FFF"/><rect y="13.33" width="24" height="2.67" fill="#FFF"/><rect y="18.67" width="24" height="2.67" fill="#FFF"/><rect width="10" height="10.67" fill="#0D5EAF"/><rect y="4" width="10" height="2.67" fill="#FFF"/><rect x="3.5" width="3" height="10.67" fill="#FFF"/><rect width="24" height="24" fill="none" stroke="#000" stroke-opacity=".1" stroke-width=".5"/></svg>',
  // Grenada — red border with yellow / green triangles and nutmeg
  'flag-gd':
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><rect width="24" height="24" fill="#CE1126"/><rect x="2" y="2" width="20" height="20" fill="#FCD116"/><polygon points="2,2 12,12 2,22" fill="#007A5E"/><polygon points="22,2 12,12 22,22" fill="#007A5E"/><polygon points="2,2 12,12 22,2" fill="#FCD116"/><polygon points="2,22 12,12 22,22" fill="#FCD116"/><circle cx="12" cy="12" r="2.5" fill="#CE1126"/><polygon points="12,10 12.4,11 13.3,11 12.5,11.6 12.8,12.5 12,12 11.2,12.5 11.5,11.6 10.7,11 11.6,11" fill="#FCD116"/><rect width="24" height="24" fill="none" stroke="#000" stroke-opacity=".1" stroke-width=".5"/></svg>',
  // Guatemala — light blue / white / light blue vertical tricolor
  'flag-gt':
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><rect width="8" height="24" fill="#4997D0"/><rect x="8" width="8" height="24" fill="#FFF"/><rect x="16" width="8" height="24" fill="#4997D0"/><rect width="24" height="24" fill="none" stroke="#000" stroke-opacity=".1" stroke-width=".5"/></svg>',
  // Guinea — red / yellow / green vertical tricolor
  'flag-gn':
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><rect width="8" height="24" fill="#CE1126"/><rect x="8" width="8" height="24" fill="#FCD116"/><rect x="16" width="8" height="24" fill="#009460"/><rect width="24" height="24" fill="none" stroke="#000" stroke-opacity=".1" stroke-width=".5"/></svg>',
  // Guinea-Bissau — red vertical bar, yellow / green horizontal
  'flag-gw':
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><rect width="8" height="24" fill="#CE1126"/><rect x="8" width="16" height="12" fill="#FCD116"/><rect x="8" y="12" width="16" height="12" fill="#006B3F"/><polygon points="4,10 4.4,11 5.3,11 4.5,11.6 4.8,12.5 4,12 3.2,12.5 3.5,11.6 2.7,11 3.6,11" fill="#000"/><rect width="24" height="24" fill="none" stroke="#000" stroke-opacity=".1" stroke-width=".5"/></svg>',
  // Guyana — green with golden / red arrow
  'flag-gy':
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><rect width="24" height="24" fill="#009E49"/><polygon points="0,0 24,12 0,24" fill="#FFF"/><polygon points="0,1 22,12 0,23" fill="#FCD116"/><polygon points="0,0 12,12 0,24" fill="#000"/><polygon points="0,1 10,12 0,23" fill="#CE1126"/><rect width="24" height="24" fill="none" stroke="#000" stroke-opacity=".1" stroke-width=".5"/></svg>',

  // ── H ──────────────────────────────────────────────────────────────
  // Haiti — blue / red horizontal
  'flag-ht':
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><rect width="24" height="12" fill="#00209F"/><rect y="12" width="24" height="12" fill="#D21034"/><rect width="24" height="24" fill="none" stroke="#000" stroke-opacity=".1" stroke-width=".5"/></svg>',
  // Honduras — blue / white / blue horizontal with 5 stars
  'flag-hn':
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><rect width="24" height="8" fill="#0073CF"/><rect y="8" width="24" height="8" fill="#FFF"/><rect y="16" width="24" height="8" fill="#0073CF"/><polygon points="8,10 8.2,10.6 8.8,10.6 8.3,11 8.5,11.5 8,11.1 7.5,11.5 7.7,11 7.2,10.6 7.8,10.6" fill="#0073CF"/><polygon points="16,10 16.2,10.6 16.8,10.6 16.3,11 16.5,11.5 16,11.1 15.5,11.5 15.7,11 15.2,10.6 15.8,10.6" fill="#0073CF"/><polygon points="12,9 12.2,9.6 12.8,9.6 12.3,10 12.5,10.5 12,10.1 11.5,10.5 11.7,10 11.2,9.6 11.8,9.6" fill="#0073CF"/><polygon points="8,13 8.2,13.6 8.8,13.6 8.3,14 8.5,14.5 8,14.1 7.5,14.5 7.7,14 7.2,13.6 7.8,13.6" fill="#0073CF"/><polygon points="16,13 16.2,13.6 16.8,13.6 16.3,14 16.5,14.5 16,14.1 15.5,14.5 15.7,14 15.2,13.6 15.8,13.6" fill="#0073CF"/><rect width="24" height="24" fill="none" stroke="#000" stroke-opacity=".1" stroke-width=".5"/></svg>',
  // Hungary — red / white / green horizontal tricolor
  'flag-hu':
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><rect width="24" height="8" fill="#CE2939"/><rect y="8" width="24" height="8" fill="#FFF"/><rect y="16" width="24" height="8" fill="#477050"/><rect width="24" height="24" fill="none" stroke="#000" stroke-opacity=".1" stroke-width=".5"/></svg>',

  // ── I ──────────────────────────────────────────────────────────────
  // Iceland — blue with red / white Scandinavian cross
  'flag-is':
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><rect width="24" height="24" fill="#003897"/><rect y="9" width="24" height="6" fill="#FFF"/><rect x="6" width="5" height="24" fill="#FFF"/><rect y="10" width="24" height="4" fill="#D72828"/><rect x="7" width="3" height="24" fill="#D72828"/><rect width="24" height="24" fill="none" stroke="#000" stroke-opacity=".1" stroke-width=".5"/></svg>',
  // India — saffron / white / green horizontal with blue chakra
  'flag-in':
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><rect width="24" height="8" fill="#FF9933"/><rect y="8" width="24" height="8" fill="#FFF"/><rect y="16" width="24" height="8" fill="#138808"/><circle cx="12" cy="12" r="2.5" fill="none" stroke="#000080" stroke-width=".5"/><circle cx="12" cy="12" r=".5" fill="#000080"/><rect width="24" height="24" fill="none" stroke="#000" stroke-opacity=".1" stroke-width=".5"/></svg>',
  // Indonesia — red / white horizontal bicolor
  'flag-id':
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><rect width="24" height="12" fill="#CE1126"/><rect y="12" width="24" height="12" fill="#FFF"/><rect width="24" height="24" fill="none" stroke="#000" stroke-opacity=".1" stroke-width=".5"/></svg>',
  // Iran — green / white / red horizontal with emblem
  'flag-ir':
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><rect width="24" height="8" fill="#239F40"/><rect y="8" width="24" height="8" fill="#FFF"/><rect y="16" width="24" height="8" fill="#DA0000"/><circle cx="12" cy="12" r="2" fill="#DA0000"/><rect width="24" height="24" fill="none" stroke="#000" stroke-opacity=".1" stroke-width=".5"/></svg>',
  // Iraq — red / white / black horizontal with green text
  'flag-iq':
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><rect width="24" height="8" fill="#CE1126"/><rect y="8" width="24" height="8" fill="#FFF"/><rect y="16" width="24" height="8" fill="#000"/><text x="12" y="14" text-anchor="middle" fill="#007A3D" font-size="3" font-family="serif">الله أكبر</text><rect width="24" height="24" fill="none" stroke="#000" stroke-opacity=".1" stroke-width=".5"/></svg>',
  // Ireland — green / white / orange vertical tricolor
  'flag-ie':
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><rect width="8" height="24" fill="#169B62"/><rect x="8" width="8" height="24" fill="#FFF"/><rect x="16" width="8" height="24" fill="#FF883E"/><rect width="24" height="24" fill="none" stroke="#000" stroke-opacity=".1" stroke-width=".5"/></svg>',
  // Israel — white with blue stripes and Star of David
  'flag-il':
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><rect width="24" height="24" fill="#FFF"/><rect y="3" width="24" height="3" fill="#0038B8"/><rect y="18" width="24" height="3" fill="#0038B8"/><polygon points="12,8 14.5,13 9.5,13" fill="none" stroke="#0038B8" stroke-width=".7"/><polygon points="12,15 9.5,10 14.5,10" fill="none" stroke="#0038B8" stroke-width=".7"/><rect width="24" height="24" fill="none" stroke="#000" stroke-opacity=".1" stroke-width=".5"/></svg>',
  // Italy — green / white / red vertical tricolor
  'flag-it':
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><rect width="8" height="24" fill="#008C45"/><rect x="8" width="8" height="24" fill="#F4F5F0"/><rect x="16" width="8" height="24" fill="#CD212A"/><rect width="24" height="24" fill="none" stroke="#000" stroke-opacity=".1" stroke-width=".5"/></svg>',

  // ── J ──────────────────────────────────────────────────────────────
  // Jamaica — gold diagonal cross, green / black
  'flag-jm':
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><rect width="24" height="24" fill="#009B3A"/><polygon points="0,0 10,10 0,20" fill="#000"/><polygon points="24,4 14,12 24,20" fill="#000"/><polygon points="4,0 12,10 20,0" fill="#000"/><polygon points="4,24 12,14 20,24" fill="#000"/><path d="M0,0L24,24M24,0L0,24" stroke="#FED100" stroke-width="3"/><rect width="24" height="24" fill="none" stroke="#000" stroke-opacity=".1" stroke-width=".5"/></svg>',
  // Japan — white with red circle
  'flag-jp':
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><rect width="24" height="24" fill="#FFF"/><circle cx="12" cy="12" r="5" fill="#BC002D"/><rect width="24" height="24" fill="none" stroke="#000" stroke-opacity=".1" stroke-width=".5"/></svg>',
  // Jordan — black / white / green horizontal with red triangle and star
  'flag-jo':
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><rect width="24" height="8" fill="#000"/><rect y="8" width="24" height="8" fill="#FFF"/><rect y="16" width="24" height="8" fill="#007A3D"/><polygon points="0,0 12,12 0,24" fill="#CE1126"/><polygon points="4,11 4.2,11.5 4.7,11.5 4.3,11.8 4.4,12.3 4,12 3.6,12.3 3.7,11.8 3.3,11.5 3.8,11.5" fill="#FFF"/><rect width="24" height="24" fill="none" stroke="#000" stroke-opacity=".1" stroke-width=".5"/></svg>',

  // ── K ──────────────────────────────────────────────────────────────
  // Kazakhstan — sky blue with yellow sun and eagle
  'flag-kz':
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><rect width="24" height="24" fill="#00AFCA"/><circle cx="12" cy="10" r="3.5" fill="#FFD700"/><circle cx="12" cy="10" r="2.5" fill="#00AFCA"/><path d="M12 6.5v-1M12 14.5v1M8.5 10H7M17 10h-1.5M9 7l-.7-.7M15.7 13.7l-.7-.7M15 7l.7-.7M8.3 13.7l.7-.7" stroke="#FFD700" stroke-width=".4"/><rect x="2" y="4" width="1.5" height="16" fill="#FFD700" fill-opacity=".3"/><rect width="24" height="24" fill="none" stroke="#000" stroke-opacity=".1" stroke-width=".5"/></svg>',
  // Kenya — black / red / green horizontal with white stripes and shield
  'flag-ke':
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><rect width="24" height="7" fill="#000"/><rect y="7" width="24" height="1" fill="#FFF"/><rect y="8" width="24" height="8" fill="#BB0000"/><rect y="16" width="24" height="1" fill="#FFF"/><rect y="17" width="24" height="7" fill="#006600"/><ellipse cx="12" cy="12" rx="2.5" ry="4" fill="#000" stroke="#FFF" stroke-width=".5"/><rect x="11.7" y="7" width=".6" height="10" fill="#FFF"/><rect width="24" height="24" fill="none" stroke="#000" stroke-opacity=".1" stroke-width=".5"/></svg>',
  // Kiribati — red / blue with yellow sun and bird
  'flag-ki':
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><rect width="24" height="12" fill="#CE1126"/><rect y="12" width="24" height="12" fill="#003F87"/><path d="M4 12h16" stroke="#FFF" stroke-width="1"/><path d="M4 14q4-2 8 0t8-2" fill="none" stroke="#FFF" stroke-width=".5"/><path d="M4 16q4-2 8 0t8-2" fill="none" stroke="#FFF" stroke-width=".5"/><circle cx="12" cy="8" r="3" fill="#FCD116"/><rect width="24" height="24" fill="none" stroke="#000" stroke-opacity=".1" stroke-width=".5"/></svg>',
  // Kuwait — green / white / red horizontal with black trapezoid
  'flag-kw':
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><rect width="24" height="8" fill="#007A3D"/><rect y="8" width="24" height="8" fill="#FFF"/><rect y="16" width="24" height="8" fill="#CE1126"/><polygon points="0,0 8,8 8,16 0,24" fill="#000"/><rect width="24" height="24" fill="none" stroke="#000" stroke-opacity=".1" stroke-width=".5"/></svg>',
  // Kyrgyzstan — red with yellow sun
  'flag-kg':
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><rect width="24" height="24" fill="#E8112D"/><circle cx="12" cy="12" r="4" fill="#FCD116"/><circle cx="12" cy="12" r="2.5" fill="#E8112D"/><rect width="24" height="24" fill="none" stroke="#000" stroke-opacity=".1" stroke-width=".5"/></svg>',
  // North Korea — blue / white / red / white / blue with star
  'flag-kp':
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><rect width="24" height="4" fill="#024FA2"/><rect y="4" width="24" height="1" fill="#FFF"/><rect y="5" width="24" height="14" fill="#ED1C27"/><rect y="19" width="24" height="1" fill="#FFF"/><rect y="20" width="24" height="4" fill="#024FA2"/><circle cx="7" cy="12" r="3" fill="#FFF"/><polygon points="7,9.5 7.5,11 9,11 7.8,12 8.2,13.5 7,12.5 5.8,13.5 6.2,12 5,11 6.5,11" fill="#ED1C27"/><rect width="24" height="24" fill="none" stroke="#000" stroke-opacity=".1" stroke-width=".5"/></svg>',
  // South Korea — white with taegeuk and trigrams
  'flag-kr':
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><rect width="24" height="24" fill="#FFF"/><circle cx="12" cy="12" r="4" fill="#CD2E3A"/><path d="M12 8a4 4 0 0 1 0 8 2 2 0 0 1 0-4 2 2 0 0 0 0-4z" fill="#0047A0"/><rect x="4" y="4" width="3" height=".7" fill="#000" transform="rotate(56 5.5 4.4)"/><rect x="4" y="5.5" width="3" height=".7" fill="#000" transform="rotate(56 5.5 5.9)"/><rect x="4" y="7" width="3" height=".7" fill="#000" transform="rotate(56 5.5 7.4)"/><rect x="17" y="16.5" width="3" height=".7" fill="#000" transform="rotate(56 18.5 16.9)"/><rect x="17" y="18" width="3" height=".7" fill="#000" transform="rotate(56 18.5 18.4)"/><rect x="17" y="19.5" width="3" height=".7" fill="#000" transform="rotate(56 18.5 19.9)"/><rect width="24" height="24" fill="none" stroke="#000" stroke-opacity=".1" stroke-width=".5"/></svg>',

  // ── L ──────────────────────────────────────────────────────────────
  // Laos — red / blue / red horizontal with white circle
  'flag-la':
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><rect width="24" height="6" fill="#CE1126"/><rect y="6" width="24" height="12" fill="#002868"/><rect y="18" width="24" height="6" fill="#CE1126"/><circle cx="12" cy="12" r="3.5" fill="#FFF"/><rect width="24" height="24" fill="none" stroke="#000" stroke-opacity=".1" stroke-width=".5"/></svg>',
  // Latvia — dark red / white / dark red horizontal
  'flag-lv':
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><rect width="24" height="10" fill="#9E3039"/><rect y="10" width="24" height="4" fill="#FFF"/><rect y="14" width="24" height="10" fill="#9E3039"/><rect width="24" height="24" fill="none" stroke="#000" stroke-opacity=".1" stroke-width=".5"/></svg>',
  // Lebanon — red / white / red horizontal with green cedar
  'flag-lb':
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><rect width="24" height="6" fill="#ED1C24"/><rect y="6" width="24" height="12" fill="#FFF"/><rect y="18" width="24" height="6" fill="#ED1C24"/><polygon points="12,7 14,14 10,14" fill="#00A651"/><rect x="11.5" y="14" width="1" height="2" fill="#6B3A1F"/><rect width="24" height="24" fill="none" stroke="#000" stroke-opacity=".1" stroke-width=".5"/></svg>',
  // Lesotho — blue / white / green horizontal with black hat
  'flag-ls':
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><rect width="24" height="8" fill="#00209F"/><rect y="8" width="24" height="8" fill="#FFF"/><rect y="16" width="24" height="8" fill="#009543"/><path d="M10 14h4l-2-4z" fill="#000"/><rect x="9" y="14" width="6" height="1" fill="#000"/><rect width="24" height="24" fill="none" stroke="#000" stroke-opacity=".1" stroke-width=".5"/></svg>',
  // Liberia — red / white stripes with blue canton and star
  'flag-lr':
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><rect width="24" height="24" fill="#FFF"/><rect width="24" height="2.18" fill="#BF0A30"/><rect y="4.36" width="24" height="2.18" fill="#BF0A30"/><rect y="8.73" width="24" height="2.18" fill="#BF0A30"/><rect y="13.1" width="24" height="2.18" fill="#BF0A30"/><rect y="17.45" width="24" height="2.18" fill="#BF0A30"/><rect y="21.82" width="24" height="2.18" fill="#BF0A30"/><rect width="10" height="10.91" fill="#002868"/><polygon points="5,3 5.5,4.5 7,4.5 5.8,5.5 6.2,7 5,6 3.8,7 4.2,5.5 3,4.5 4.5,4.5" fill="#FFF"/><rect width="24" height="24" fill="none" stroke="#000" stroke-opacity=".1" stroke-width=".5"/></svg>',
  // Libya — red / black / green horizontal with crescent and star
  'flag-ly':
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><rect width="24" height="6" fill="#E70013"/><rect y="6" width="24" height="12" fill="#000"/><rect y="18" width="24" height="6" fill="#239E46"/><circle cx="11" cy="12" r="2.5" fill="#FFF"/><circle cx="11.8" cy="12" r="2" fill="#000"/><polygon points="14,12 13.5,11 14.5,11.6 13.3,11.6 14.3,11" fill="#FFF"/><rect width="24" height="24" fill="none" stroke="#000" stroke-opacity=".1" stroke-width=".5"/></svg>',
  // Liechtenstein — blue / red horizontal with gold crown
  'flag-li':
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><rect width="24" height="12" fill="#002B7F"/><rect y="12" width="24" height="12" fill="#CE1126"/><path d="M5 5h3v2H5z" fill="#FFD700"/><path d="M5 4l1.5-1 1.5 1" fill="#FFD700"/><rect width="24" height="24" fill="none" stroke="#000" stroke-opacity=".1" stroke-width=".5"/></svg>',
  // Lithuania — yellow / green / red horizontal tricolor
  'flag-lt':
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><rect width="24" height="8" fill="#FDB913"/><rect y="8" width="24" height="8" fill="#006A44"/><rect y="16" width="24" height="8" fill="#C1272D"/><rect width="24" height="24" fill="none" stroke="#000" stroke-opacity=".1" stroke-width=".5"/></svg>',
  // Luxembourg — red / white / light blue horizontal tricolor
  'flag-lu':
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><rect width="24" height="8" fill="#ED2939"/><rect y="8" width="24" height="8" fill="#FFF"/><rect y="16" width="24" height="8" fill="#00A1DE"/><rect width="24" height="24" fill="none" stroke="#000" stroke-opacity=".1" stroke-width=".5"/></svg>',

  // ── M ──────────────────────────────────────────────────────────────
  // Madagascar — white vertical bar, red / green horizontal
  'flag-mg':
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><rect width="8" height="24" fill="#FFF"/><rect x="8" width="16" height="12" fill="#FC3D32"/><rect x="8" y="12" width="16" height="12" fill="#007E3A"/><rect width="24" height="24" fill="none" stroke="#000" stroke-opacity=".1" stroke-width=".5"/></svg>',
  // Malawi — black / red / green horizontal with red sun
  'flag-mw':
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><rect width="24" height="8" fill="#000"/><rect y="8" width="24" height="8" fill="#CE1126"/><rect y="16" width="24" height="8" fill="#339E35"/><circle cx="12" cy="4" r="3" fill="#CE1126"/><rect width="24" height="24" fill="none" stroke="#000" stroke-opacity=".1" stroke-width=".5"/></svg>',
  // Malaysia — red / white stripes with blue canton, crescent and star
  'flag-my':
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><rect width="24" height="24" fill="#FFF"/><rect width="24" height="1.71" fill="#CC0001"/><rect y="3.43" width="24" height="1.71" fill="#CC0001"/><rect y="6.86" width="24" height="1.71" fill="#CC0001"/><rect y="10.29" width="24" height="1.71" fill="#CC0001"/><rect y="13.71" width="24" height="1.71" fill="#CC0001"/><rect y="17.14" width="24" height="1.71" fill="#CC0001"/><rect y="20.57" width="24" height="1.71" fill="#CC0001"/><rect width="12" height="12" fill="#010066"/><circle cx="5" cy="6" r="2.5" fill="#FFC726"/><circle cx="5.8" cy="6" r="2" fill="#010066"/><polygon points="8.5,6 8,5 9.2,5.7 7.8,5.7 9,5" fill="#FFC726"/><rect width="24" height="24" fill="none" stroke="#000" stroke-opacity=".1" stroke-width=".5"/></svg>',
  // Maldives — red with green rectangle and white crescent
  'flag-mv':
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><rect width="24" height="24" fill="#D21034"/><rect x="4" y="4" width="16" height="16" fill="#007E3A"/><circle cx="13" cy="12" r="3" fill="#FFF"/><circle cx="14" cy="12" r="2.5" fill="#007E3A"/><rect width="24" height="24" fill="none" stroke="#000" stroke-opacity=".1" stroke-width=".5"/></svg>',
  // Mali — green / yellow / red vertical tricolor
  'flag-ml':
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><rect width="8" height="24" fill="#14B53A"/><rect x="8" width="8" height="24" fill="#FCD116"/><rect x="16" width="8" height="24" fill="#CE1126"/><rect width="24" height="24" fill="none" stroke="#000" stroke-opacity=".1" stroke-width=".5"/></svg>',
  // Malta — white / red vertical with gray cross
  'flag-mt':
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><rect width="12" height="24" fill="#FFF"/><rect x="12" width="12" height="24" fill="#CE1126"/><rect x="2" y="2" width="4" height="4" fill="none" stroke="#8C8C8C" stroke-width=".5"/><path d="M3 2v4M5 2v4M2 3h4M2 5h4" stroke="#8C8C8C" stroke-width=".3"/><rect width="24" height="24" fill="none" stroke="#000" stroke-opacity=".1" stroke-width=".5"/></svg>',
  // Marshall Islands — blue with orange / white diagonal and star
  'flag-mh':
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><rect width="24" height="24" fill="#003893"/><polygon points="0,24 24,8 24,12 0,24" fill="#FFF"/><polygon points="0,24 24,4 24,8 0,24" fill="#DD7500"/><polygon points="5,5 5.6,6.8 7.5,6.8 6,7.9 6.5,9.7 5,8.5 3.5,9.7 4,7.9 2.5,6.8 4.4,6.8" fill="#FFF"/><rect width="24" height="24" fill="none" stroke="#000" stroke-opacity=".1" stroke-width=".5"/></svg>',
  // Mauritania — green with gold crescent, star, and red stripes
  'flag-mr':
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><rect width="24" height="3" fill="#CE1126"/><rect y="3" width="24" height="18" fill="#006233"/><rect y="21" width="24" height="3" fill="#CE1126"/><circle cx="12" cy="11" r="3.5" fill="#FFC400"/><circle cx="12" cy="10" r="3" fill="#006233"/><polygon points="12,7 12.3,7.8 13.1,7.8 12.4,8.3 12.7,9.1 12,8.6 11.3,9.1 11.6,8.3 10.9,7.8 11.7,7.8" fill="#FFC400"/><rect width="24" height="24" fill="none" stroke="#000" stroke-opacity=".1" stroke-width=".5"/></svg>',
  // Mauritius — red / blue / yellow / green horizontal
  'flag-mu':
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><rect width="24" height="6" fill="#EA2839"/><rect y="6" width="24" height="6" fill="#1A206D"/><rect y="12" width="24" height="6" fill="#FFD500"/><rect y="18" width="24" height="6" fill="#00A551"/><rect width="24" height="24" fill="none" stroke="#000" stroke-opacity=".1" stroke-width=".5"/></svg>',
  // Mexico — green / white / red vertical with eagle (simplified)
  'flag-mx':
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><rect width="8" height="24" fill="#006341"/><rect x="8" width="8" height="24" fill="#FFF"/><rect x="16" width="8" height="24" fill="#CE1126"/><circle cx="12" cy="12" r="2" fill="#6B3A1F"/><circle cx="12" cy="12" r="1.2" fill="#006341"/><rect width="24" height="24" fill="none" stroke="#000" stroke-opacity=".1" stroke-width=".5"/></svg>',
  // Micronesia — light blue with 4 white stars
  'flag-fm':
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><rect width="24" height="24" fill="#75B2DD"/><polygon points="12,5 12.3,5.8 13.1,5.8 12.4,6.3 12.7,7.1 12,6.6 11.3,7.1 11.6,6.3 10.9,5.8 11.7,5.8" fill="#FFF"/><polygon points="12,17 12.3,17.8 13.1,17.8 12.4,18.3 12.7,19.1 12,18.6 11.3,19.1 11.6,18.3 10.9,17.8 11.7,17.8" fill="#FFF"/><polygon points="6,11 6.3,11.8 7.1,11.8 6.4,12.3 6.7,13.1 6,12.6 5.3,13.1 5.6,12.3 4.9,11.8 5.7,11.8" fill="#FFF"/><polygon points="18,11 18.3,11.8 19.1,11.8 18.4,12.3 18.7,13.1 18,12.6 17.3,13.1 17.6,12.3 16.9,11.8 17.7,11.8" fill="#FFF"/><rect width="24" height="24" fill="none" stroke="#000" stroke-opacity=".1" stroke-width=".5"/></svg>',
  // Moldova — blue / yellow / red vertical with eagle
  'flag-md':
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><rect width="8" height="24" fill="#0046AE"/><rect x="8" width="8" height="24" fill="#FFD200"/><rect x="16" width="8" height="24" fill="#CC0033"/><path d="M12 9v4M10 10h4" stroke="#8B4513" stroke-width=".5"/><rect width="24" height="24" fill="none" stroke="#000" stroke-opacity=".1" stroke-width=".5"/></svg>',
  // Monaco — red / white horizontal bicolor
  'flag-mc':
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><rect width="24" height="12" fill="#CE1126"/><rect y="12" width="24" height="12" fill="#FFF"/><rect width="24" height="24" fill="none" stroke="#000" stroke-opacity=".1" stroke-width=".5"/></svg>',
  // Mongolia — red / blue / red vertical with soyombo
  'flag-mn':
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><rect width="8" height="24" fill="#C4272F"/><rect x="8" width="8" height="24" fill="#015197"/><rect x="16" width="8" height="24" fill="#C4272F"/><circle cx="4" cy="9" r="1.5" fill="#F9CF02"/><rect x="3" y="11" width="2" height="4" fill="#F9CF02"/><rect width="24" height="24" fill="none" stroke="#000" stroke-opacity=".1" stroke-width=".5"/></svg>',
  // Montenegro — red with gold border and eagle
  'flag-me':
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><rect width="24" height="24" fill="#C40308"/><rect x="1" y="1" width="22" height="22" fill="none" stroke="#D4AF37" stroke-width="1.5"/><path d="M12 8l-2 3 1 1-1 2h4l-1-2 1-1z" fill="#D4AF37"/><rect width="24" height="24" fill="none" stroke="#000" stroke-opacity=".1" stroke-width=".5"/></svg>',
  // Morocco — red with green pentagram
  'flag-ma':
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><rect width="24" height="24" fill="#C1272D"/><polygon points="12,7 13,10.5 16.5,10.5 13.8,12.8 14.8,16 12,13.8 9.2,16 10.2,12.8 7.5,10.5 11,10.5" fill="none" stroke="#006233" stroke-width=".8"/><rect width="24" height="24" fill="none" stroke="#000" stroke-opacity=".1" stroke-width=".5"/></svg>',
  // Mozambique — green / black / yellow horizontal with red triangle and star
  'flag-mz':
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><rect width="24" height="7" fill="#009A44"/><rect y="7" width="24" height="1" fill="#FFF"/><rect y="8" width="24" height="8" fill="#000"/><rect y="16" width="24" height="1" fill="#FFF"/><rect y="17" width="24" height="7" fill="#FCE100"/><polygon points="0,0 10,12 0,24" fill="#D21034"/><polygon points="3,10 3.4,11 4.3,11 3.5,11.6 3.8,12.5 3,12 2.2,12.5 2.5,11.6 1.7,11 2.6,11" fill="#FCE100"/><rect width="24" height="24" fill="none" stroke="#000" stroke-opacity=".1" stroke-width=".5"/></svg>',
  // Myanmar — yellow / green / red horizontal with white star
  'flag-mm':
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><rect width="24" height="8" fill="#FECB00"/><rect y="8" width="24" height="8" fill="#34B233"/><rect y="16" width="24" height="8" fill="#EA2839"/><polygon points="12,7 13,10 16,10 13.5,12 14.5,15 12,13 9.5,15 10.5,12 8,10 11,10" fill="#FFF"/><rect width="24" height="24" fill="none" stroke="#000" stroke-opacity=".1" stroke-width=".5"/></svg>',

  // ── N ──────────────────────────────────────────────────────────────
  // Namibia — blue / red / green diagonal with white stripes and sun
  'flag-na':
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><polygon points="0,0 0,24 24,0" fill="#003580"/><polygon points="24,24 24,0 0,24" fill="#009A44"/><polygon points="0,20 0,24 4,24 24,4 24,0 20,0" fill="#FFF"/><polygon points="0,19 0,24 5,24 24,5 24,0 19,0" fill="#C70000"/><circle cx="6" cy="6" r="3" fill="#FFD700"/><circle cx="6" cy="6" r="2" fill="#003580"/><rect width="24" height="24" fill="none" stroke="#000" stroke-opacity=".1" stroke-width=".5"/></svg>',
  // Nauru — blue with yellow stripe and white star
  'flag-nr':
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><rect width="24" height="24" fill="#002B7F"/><rect y="11" width="24" height="2" fill="#FFC72C"/><polygon points="5,17 5.4,18 6.3,18 5.5,18.6 5.8,19.5 5,19 4.2,19.5 4.5,18.6 3.7,18 4.6,18" fill="#FFF"/><rect width="24" height="24" fill="none" stroke="#000" stroke-opacity=".1" stroke-width=".5"/></svg>',
  // Nepal — unique double-pennant (crimson with blue border)
  'flag-np':
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><rect width="24" height="24" fill="#FFF"/><polygon points="2,2 2,22 16,22 8,14 18,14 8,2" fill="#003893"/><polygon points="3,3 3,21 15,21 7.5,13.5 17,13.5 8,3" fill="#DC143C"/><circle cx="7" cy="8" r="1.5" fill="#FFF"/><circle cx="7" cy="17" r="1.5" fill="#FFF"/><rect width="24" height="24" fill="none" stroke="#000" stroke-opacity=".1" stroke-width=".5"/></svg>',
  // Netherlands — red / white / blue horizontal tricolor
  'flag-nl':
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><rect width="24" height="8" fill="#AE1C28"/><rect y="8" width="24" height="8" fill="#FFF"/><rect y="16" width="24" height="8" fill="#21468B"/><rect width="24" height="24" fill="none" stroke="#000" stroke-opacity=".1" stroke-width=".5"/></svg>',
  // New Zealand — blue with Union Jack canton and 4 red stars
  'flag-nz':
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><rect width="24" height="24" fill="#00247D"/><rect width="12" height="12" fill="#012169"/><path d="M0 0l12 12M12 0L0 12" stroke="#FFF" stroke-width="2"/><path d="M0 0l12 12M12 0L0 12" stroke="#C8102E" stroke-width="1"/><rect y="5" width="12" height="2" fill="#FFF"/><rect x="5" width="2" height="12" fill="#FFF"/><rect y="5.4" width="12" height="1.2" fill="#C8102E"/><rect x="5.4" width="1.2" height="12" fill="#C8102E"/><polygon points="18,6 18.3,7 19.2,7 18.5,7.5 18.7,8.5 18,8 17.3,8.5 17.5,7.5 16.8,7 17.7,7" fill="#C8102E" stroke="#FFF" stroke-width=".3"/><polygon points="20,10 20.3,11 21.2,11 20.5,11.5 20.7,12.5 20,12 19.3,12.5 19.5,11.5 18.8,11 19.7,11" fill="#C8102E" stroke="#FFF" stroke-width=".3"/><polygon points="19,16 19.3,17 20.2,17 19.5,17.5 19.7,18.5 19,18 18.3,18.5 18.5,17.5 17.8,17 18.7,17" fill="#C8102E" stroke="#FFF" stroke-width=".3"/><polygon points="16,13 16.3,14 17.2,14 16.5,14.5 16.7,15.5 16,15 15.3,15.5 15.5,14.5 14.8,14 15.7,14" fill="#C8102E" stroke="#FFF" stroke-width=".3"/><rect width="24" height="24" fill="none" stroke="#000" stroke-opacity=".1" stroke-width=".5"/></svg>',
  // Nicaragua — blue / white / blue horizontal
  'flag-ni':
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><rect width="24" height="8" fill="#0067C6"/><rect y="8" width="24" height="8" fill="#FFF"/><rect y="16" width="24" height="8" fill="#0067C6"/><rect width="24" height="24" fill="none" stroke="#000" stroke-opacity=".1" stroke-width=".5"/></svg>',
  // Niger — orange / white / green horizontal with orange circle
  'flag-ne':
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><rect width="24" height="8" fill="#E05206"/><rect y="8" width="24" height="8" fill="#FFF"/><rect y="16" width="24" height="8" fill="#0DB02B"/><circle cx="12" cy="12" r="2" fill="#E05206"/><rect width="24" height="24" fill="none" stroke="#000" stroke-opacity=".1" stroke-width=".5"/></svg>',
  // Nigeria — green / white / green vertical tricolor
  'flag-ng':
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><rect width="8" height="24" fill="#008751"/><rect x="8" width="8" height="24" fill="#FFF"/><rect x="16" width="8" height="24" fill="#008751"/><rect width="24" height="24" fill="none" stroke="#000" stroke-opacity=".1" stroke-width=".5"/></svg>',
  // North Macedonia — red with yellow sun (8 rays)
  'flag-mk':
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><rect width="24" height="24" fill="#D20000"/><circle cx="12" cy="12" r="3" fill="#FFE600"/><path d="M12 0v24M0 12h24M0 0l24 24M24 0L0 24" stroke="#FFE600" stroke-width="1.5"/><circle cx="12" cy="12" r="3.5" fill="#FFE600"/><circle cx="12" cy="12" r="2.5" fill="#D20000"/><rect width="24" height="24" fill="none" stroke="#000" stroke-opacity=".1" stroke-width=".5"/></svg>',
  // Norway — red with blue / white Scandinavian cross
  'flag-no':
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><rect width="24" height="24" fill="#EF2B2D"/><rect y="9" width="24" height="6" fill="#FFF"/><rect x="6" width="5" height="24" fill="#FFF"/><rect y="10" width="24" height="4" fill="#002868"/><rect x="7" width="3" height="24" fill="#002868"/><rect width="24" height="24" fill="none" stroke="#000" stroke-opacity=".1" stroke-width=".5"/></svg>',

  // ── O ──────────────────────────────────────────────────────────────
  // Oman — white / red / green horizontal with red vertical bar
  'flag-om':
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><rect width="24" height="8" fill="#FFF"/><rect y="8" width="24" height="8" fill="#DB161B"/><rect y="16" width="24" height="8" fill="#008000"/><rect width="7" height="24" fill="#DB161B"/><rect width="24" height="24" fill="none" stroke="#000" stroke-opacity=".1" stroke-width=".5"/></svg>',

  // ── P ──────────────────────────────────────────────────────────────
  // Pakistan — green with white vertical bar, crescent and star
  'flag-pk':
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><rect width="6" height="24" fill="#FFF"/><rect x="6" width="18" height="24" fill="#01411C"/><circle cx="14" cy="12" r="3.5" fill="#FFF"/><circle cx="15" cy="11.5" r="2.8" fill="#01411C"/><polygon points="17,9 17.3,9.8 18.1,9.8 17.4,10.3 17.7,11.1 17,10.6 16.3,11.1 16.6,10.3 15.9,9.8 16.7,9.8" fill="#FFF"/><rect width="24" height="24" fill="none" stroke="#000" stroke-opacity=".1" stroke-width=".5"/></svg>',
  // Palau — light blue with yellow circle
  'flag-pw':
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><rect width="24" height="24" fill="#4AADD6"/><circle cx="11" cy="12" r="5" fill="#FFDE00"/><rect width="24" height="24" fill="none" stroke="#000" stroke-opacity=".1" stroke-width=".5"/></svg>',
  // Palestine — black / white / green horizontal with red triangle
  'flag-ps':
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><rect width="24" height="8" fill="#000"/><rect y="8" width="24" height="8" fill="#FFF"/><rect y="16" width="24" height="8" fill="#007A3D"/><polygon points="0,0 10,12 0,24" fill="#CE1126"/><rect width="24" height="24" fill="none" stroke="#000" stroke-opacity=".1" stroke-width=".5"/></svg>',
  // Panama — quartered white / blue / red with stars
  'flag-pa':
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><rect width="12" height="12" fill="#FFF"/><rect x="12" width="12" height="12" fill="#CE1126"/><rect y="12" width="12" height="12" fill="#0067C6"/><rect x="12" y="12" width="12" height="12" fill="#FFF"/><polygon points="6,4 6.3,5 7.2,5 6.5,5.5 6.7,6.5 6,6 5.3,6.5 5.5,5.5 4.8,5 5.7,5" fill="#0067C6"/><polygon points="18,16 18.3,17 19.2,17 18.5,17.5 18.7,18.5 18,18 17.3,18.5 17.5,17.5 16.8,17 17.7,17" fill="#CE1126"/><rect width="24" height="24" fill="none" stroke="#000" stroke-opacity=".1" stroke-width=".5"/></svg>',
  // Papua New Guinea — red / black diagonal with bird and stars
  'flag-pg':
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><polygon points="0,0 24,0 0,24" fill="#000"/><polygon points="24,0 24,24 0,24" fill="#CE1126"/><polygon points="5,6 5.2,6.5 5.7,6.5 5.3,6.8 5.4,7.3 5,7 4.6,7.3 4.7,6.8 4.3,6.5 4.8,6.5" fill="#FFF"/><polygon points="4,10 4.2,10.5 4.7,10.5 4.3,10.8 4.4,11.3 4,11 3.6,11.3 3.7,10.8 3.3,10.5 3.8,10.5" fill="#FFF"/><polygon points="6,14 6.2,14.5 6.7,14.5 6.3,14.8 6.4,15.3 6,15 5.6,15.3 5.7,14.8 5.3,14.5 5.8,14.5" fill="#FFF"/><polygon points="3,14 3.2,14.5 3.7,14.5 3.3,14.8 3.4,15.3 3,15 2.6,15.3 2.7,14.8 2.3,14.5 2.8,14.5" fill="#FFF"/><path d="M17 5l2 1-1 2 2-1 1 3-2-1v2l-1-2-2 1 1-2-2 1z" fill="#FFC726"/><rect width="24" height="24" fill="none" stroke="#000" stroke-opacity=".1" stroke-width=".5"/></svg>',
  // Paraguay — red / white / blue horizontal tricolor
  'flag-py':
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><rect width="24" height="8" fill="#D52B1E"/><rect y="8" width="24" height="8" fill="#FFF"/><rect y="16" width="24" height="8" fill="#0038A8"/><circle cx="12" cy="12" r="2" fill="none" stroke="#000" stroke-width=".5"/><rect width="24" height="24" fill="none" stroke="#000" stroke-opacity=".1" stroke-width=".5"/></svg>',
  // Peru — red / white / red vertical tricolor
  'flag-pe':
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><rect width="8" height="24" fill="#D91023"/><rect x="8" width="8" height="24" fill="#FFF"/><rect x="16" width="8" height="24" fill="#D91023"/><rect width="24" height="24" fill="none" stroke="#000" stroke-opacity=".1" stroke-width=".5"/></svg>',
  // Philippines — blue / red horizontal with white triangle and sun/stars
  'flag-ph':
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><rect width="24" height="12" fill="#0038A8"/><rect y="12" width="24" height="12" fill="#CE1126"/><polygon points="0,0 12,12 0,24" fill="#FFF"/><circle cx="4" cy="12" r="1.5" fill="#FCD116"/><polygon points="1,6 1.2,6.4 1.7,6.4 1.3,6.7 1.4,7.2 1,6.9 .6,7.2 .7,6.7 .3,6.4 .8,6.4" fill="#FCD116"/><polygon points="1,17 1.2,17.4 1.7,17.4 1.3,17.7 1.4,18.2 1,17.9 .6,18.2 .7,17.7 .3,17.4 .8,17.4" fill="#FCD116"/><polygon points="8,12 8.2,12.4 8.7,12.4 8.3,12.7 8.4,13.2 8,12.9 7.6,13.2 7.7,12.7 7.3,12.4 7.8,12.4" fill="#FCD116"/><rect width="24" height="24" fill="none" stroke="#000" stroke-opacity=".1" stroke-width=".5"/></svg>',
  // Poland — white / red horizontal bicolor
  'flag-pl':
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><rect width="24" height="12" fill="#FFF"/><rect y="12" width="24" height="12" fill="#DC143C"/><rect width="24" height="24" fill="none" stroke="#000" stroke-opacity=".1" stroke-width=".5"/></svg>',
  // Portugal — green / red vertical with armillary sphere
  'flag-pt':
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><rect width="9" height="24" fill="#006600"/><rect x="9" width="15" height="24" fill="#FF0000"/><circle cx="9" cy="12" r="3.5" fill="#FFD700"/><circle cx="9" cy="12" r="2.5" fill="#003399"/><circle cx="9" cy="12" r="1.5" fill="#FFF"/><rect width="24" height="24" fill="none" stroke="#000" stroke-opacity=".1" stroke-width=".5"/></svg>',

  // ── Q ──────────────────────────────────────────────────────────────
  // Qatar — white / maroon with serrated edge
  'flag-qa':
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><rect width="24" height="24" fill="#8D1B3D"/><polygon points="0,0 8,0 10,2 8,4 10,6 8,8 10,10 8,12 10,14 8,16 10,18 8,20 10,22 8,24 0,24" fill="#FFF"/><rect width="24" height="24" fill="none" stroke="#000" stroke-opacity=".1" stroke-width=".5"/></svg>',

  // ── R ──────────────────────────────────────────────────────────────
  // Romania — blue / yellow / red vertical tricolor
  'flag-ro':
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><rect width="8" height="24" fill="#002B7F"/><rect x="8" width="8" height="24" fill="#FCD116"/><rect x="16" width="8" height="24" fill="#CE1126"/><rect width="24" height="24" fill="none" stroke="#000" stroke-opacity=".1" stroke-width=".5"/></svg>',
  // Russia — white / blue / red horizontal tricolor
  'flag-ru':
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><rect width="24" height="8" fill="#FFF"/><rect y="8" width="24" height="8" fill="#0039A6"/><rect y="16" width="24" height="8" fill="#D52B1E"/><rect width="24" height="24" fill="none" stroke="#000" stroke-opacity=".1" stroke-width=".5"/></svg>',
  // Rwanda — blue / yellow / green horizontal with sun
  'flag-rw':
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><rect width="24" height="12" fill="#00A1DE"/><rect y="12" width="24" height="6" fill="#FAD201"/><rect y="18" width="24" height="6" fill="#20603D"/><circle cx="18" cy="6" r="2.5" fill="#FAD201"/><circle cx="18" cy="6" r="1.5" fill="#00A1DE"/><rect width="24" height="24" fill="none" stroke="#000" stroke-opacity=".1" stroke-width=".5"/></svg>',

  // ── S ──────────────────────────────────────────────────────────────
  // Saint Kitts and Nevis — green / red diagonal with black stripe and stars
  'flag-kn':
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><polygon points="0,0 0,24 24,24" fill="#009E49"/><polygon points="0,0 24,0 24,24" fill="#CE1126"/><polygon points="0,19 0,24 5,24 24,5 24,0 19,0" fill="#FCD116"/><polygon points="0,18 0,24 6,24 24,6 24,0 18,0" fill="#000"/><polygon points="0,17 0,24 7,24 24,7 24,0 17,0" fill="#FCD116"/><polygon points="7,17 7.4,18 8.3,18 7.5,18.6 7.8,19.5 7,19 6.2,19.5 6.5,18.6 5.7,18 6.6,18" fill="#FFF"/><polygon points="17,7 17.4,8 18.3,8 17.5,8.6 17.8,9.5 17,9 16.2,9.5 16.5,8.6 15.7,8 16.6,8" fill="#FFF"/><rect width="24" height="24" fill="none" stroke="#000" stroke-opacity=".1" stroke-width=".5"/></svg>',
  // Saint Lucia — light blue with black / white / yellow triangle
  'flag-lc':
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><rect width="24" height="24" fill="#65CFFF"/><polygon points="12,4 18,20 6,20" fill="#000"/><polygon points="12,4 17,20 7,20" fill="#FFF"/><polygon points="12,10 16,20 8,20" fill="#FCD116"/><rect width="24" height="24" fill="none" stroke="#000" stroke-opacity=".1" stroke-width=".5"/></svg>',
  // Saint Vincent and the Grenadines — blue / yellow / green with diamonds
  'flag-vc':
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><rect width="7" height="24" fill="#0072C6"/><rect x="7" width="10" height="24" fill="#FCD116"/><rect x="17" width="7" height="24" fill="#009E60"/><polygon points="10,8 12,12 10,16 8,12" fill="#009E60"/><polygon points="14,8 16,12 14,16 12,12" fill="#009E60"/><polygon points="12,12 14,16 12,20 10,16" fill="#009E60"/><rect width="24" height="24" fill="none" stroke="#000" stroke-opacity=".1" stroke-width=".5"/></svg>',
  // Samoa — red with blue canton and white stars
  'flag-ws':
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><rect width="24" height="24" fill="#CE1126"/><rect width="12" height="12" fill="#002B7F"/><polygon points="4,3 4.2,3.5 4.7,3.5 4.3,3.8 4.4,4.3 4,4 3.6,4.3 3.7,3.8 3.3,3.5 3.8,3.5" fill="#FFF"/><polygon points="8,3 8.2,3.5 8.7,3.5 8.3,3.8 8.4,4.3 8,4 7.6,4.3 7.7,3.8 7.3,3.5 7.8,3.5" fill="#FFF"/><polygon points="6,6 6.2,6.5 6.7,6.5 6.3,6.8 6.4,7.3 6,7 5.6,7.3 5.7,6.8 5.3,6.5 5.8,6.5" fill="#FFF"/><polygon points="4,9 4.2,9.5 4.7,9.5 4.3,9.8 4.4,10.3 4,10 3.6,10.3 3.7,9.8 3.3,9.5 3.8,9.5" fill="#FFF"/><polygon points="9,8 9.15,8.4 9.55,8.4 9.2,8.6 9.35,9 9,8.8 8.65,9 8.8,8.6 8.45,8.4 8.85,8.4" fill="#FFF"/><rect width="24" height="24" fill="none" stroke="#000" stroke-opacity=".1" stroke-width=".5"/></svg>',
  // San Marino — white / light blue horizontal with coat of arms
  'flag-sm':
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><rect width="24" height="12" fill="#FFF"/><rect y="12" width="24" height="12" fill="#5EB6E4"/><circle cx="12" cy="12" r="3" fill="#FFF" stroke="#5EB6E4" stroke-width=".5"/><rect width="24" height="24" fill="none" stroke="#000" stroke-opacity=".1" stroke-width=".5"/></svg>',
  // São Tomé and Príncipe — green / yellow / green with red triangle and stars
  'flag-st':
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><rect width="24" height="8" fill="#12AD2B"/><rect y="8" width="24" height="8" fill="#FFCE00"/><rect y="16" width="24" height="8" fill="#12AD2B"/><polygon points="0,0 8,12 0,24" fill="#D21034"/><polygon points="13,11 13.2,11.5 13.7,11.5 13.3,11.8 13.4,12.3 13,12 12.6,12.3 12.7,11.8 12.3,11.5 12.8,11.5" fill="#000"/><polygon points="16,11 16.2,11.5 16.7,11.5 16.3,11.8 16.4,12.3 16,12 15.6,12.3 15.7,11.8 15.3,11.5 15.8,11.5" fill="#000"/><rect width="24" height="24" fill="none" stroke="#000" stroke-opacity=".1" stroke-width=".5"/></svg>',
  // Saudi Arabia — green with white text and sword (simplified)
  'flag-sa':
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><rect width="24" height="24" fill="#006C35"/><rect x="5" y="8" width="14" height="3" rx="1" fill="#FFF" fill-opacity=".8"/><rect x="7" y="14" width="10" height=".8" fill="#FFF"/><rect width="24" height="24" fill="none" stroke="#000" stroke-opacity=".1" stroke-width=".5"/></svg>',
  // Senegal — green / yellow / red vertical with green star
  'flag-sn':
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><rect width="8" height="24" fill="#00853F"/><rect x="8" width="8" height="24" fill="#FDEF42"/><rect x="16" width="8" height="24" fill="#E31B23"/><polygon points="12,9 12.5,10.5 14,10.5 12.8,11.5 13.2,13 12,12 10.8,13 11.2,11.5 10,10.5 11.5,10.5" fill="#00853F"/><rect width="24" height="24" fill="none" stroke="#000" stroke-opacity=".1" stroke-width=".5"/></svg>',
  // Serbia — red / blue / white horizontal with coat of arms
  'flag-rs':
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><rect width="24" height="8" fill="#C6363C"/><rect y="8" width="24" height="8" fill="#0C4076"/><rect y="16" width="24" height="8" fill="#FFF"/><rect x="4" y="5" width="5" height="6" rx="1" fill="#FFF" stroke="#C6363C" stroke-width=".5"/><rect width="24" height="24" fill="none" stroke="#000" stroke-opacity=".1" stroke-width=".5"/></svg>',
  // Seychelles — radiating stripes from bottom-left
  'flag-sc':
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><rect width="24" height="24" fill="#003F87"/><polygon points="0,24 10,0 0,0" fill="#003F87"/><polygon points="0,24 10,0 16,0" fill="#FCD955"/><polygon points="0,24 16,0 22,0" fill="#D62828"/><polygon points="0,24 22,0 24,0 24,14" fill="#FFF"/><polygon points="0,24 24,14 24,24" fill="#007A3D"/><rect width="24" height="24" fill="none" stroke="#000" stroke-opacity=".1" stroke-width=".5"/></svg>',
  // Sierra Leone — green / white / blue horizontal tricolor
  'flag-sl':
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><rect width="24" height="8" fill="#1EB53A"/><rect y="8" width="24" height="8" fill="#FFF"/><rect y="16" width="24" height="8" fill="#0072C6"/><rect width="24" height="24" fill="none" stroke="#000" stroke-opacity=".1" stroke-width=".5"/></svg>',
  // Singapore — red / white with crescent and stars
  'flag-sg':
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><rect width="24" height="12" fill="#ED2939"/><rect y="12" width="24" height="12" fill="#FFF"/><circle cx="6" cy="6" r="2.5" fill="#FFF"/><circle cx="7" cy="6" r="2" fill="#ED2939"/><polygon points="10,3.5 10.2,4 10.7,4 10.3,4.3 10.4,4.8 10,4.5 9.6,4.8 9.7,4.3 9.3,4 9.8,4" fill="#FFF"/><polygon points="12,5 12.2,5.5 12.7,5.5 12.3,5.8 12.4,6.3 12,6 11.6,6.3 11.7,5.8 11.3,5.5 11.8,5.5" fill="#FFF"/><polygon points="11,7.5 11.2,8 11.7,8 11.3,8.3 11.4,8.8 11,8.5 10.6,8.8 10.7,8.3 10.3,8 10.8,8" fill="#FFF"/><polygon points="9,7.5 9.2,8 9.7,8 9.3,8.3 9.4,8.8 9,8.5 8.6,8.8 8.7,8.3 8.3,8 8.8,8" fill="#FFF"/><polygon points="10,9 10.15,9.4 10.55,9.4 10.2,9.6 10.35,10 10,9.8 9.65,10 9.8,9.6 9.45,9.4 9.85,9.4" fill="#FFF"/><rect width="24" height="24" fill="none" stroke="#000" stroke-opacity=".1" stroke-width=".5"/></svg>',
  // Slovakia — white / blue / red horizontal with shield
  'flag-sk':
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><rect width="24" height="8" fill="#FFF"/><rect y="8" width="24" height="8" fill="#0B4EA2"/><rect y="16" width="24" height="8" fill="#EE1C25"/><rect x="3" y="5" width="6" height="8" rx="1" fill="#EE1C25"/><path d="M4 11h4M6 9v4" stroke="#FFF" stroke-width=".5"/><rect width="24" height="24" fill="none" stroke="#000" stroke-opacity=".1" stroke-width=".5"/></svg>',
  // Slovenia — white / blue / red horizontal with coat of arms
  'flag-si':
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><rect width="24" height="8" fill="#FFF"/><rect y="8" width="24" height="8" fill="#003DA5"/><rect y="16" width="24" height="8" fill="#ED1C24"/><path d="M4 4l2 4 2-4" fill="#003DA5"/><path d="M4 5h4" stroke="#FFF" stroke-width=".3"/><rect width="24" height="24" fill="none" stroke="#000" stroke-opacity=".1" stroke-width=".5"/></svg>',
  // Solomon Islands — blue / green diagonal with yellow stripe and stars
  'flag-sb':
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><polygon points="0,0 24,0 0,24" fill="#0051A5"/><polygon points="24,24 24,0 0,24" fill="#215B33"/><polygon points="0,21 0,24 3,24 24,3 24,0 21,0" fill="#FCD116"/><polygon points="3,3 3.2,3.5 3.7,3.5 3.3,3.8 3.4,4.3 3,4 2.6,4.3 2.7,3.8 2.3,3.5 2.8,3.5" fill="#FFF"/><polygon points="6,3 6.2,3.5 6.7,3.5 6.3,3.8 6.4,4.3 6,4 5.6,4.3 5.7,3.8 5.3,3.5 5.8,3.5" fill="#FFF"/><polygon points="3,6 3.2,6.5 3.7,6.5 3.3,6.8 3.4,7.3 3,7 2.6,7.3 2.7,6.8 2.3,6.5 2.8,6.5" fill="#FFF"/><polygon points="6,6 6.2,6.5 6.7,6.5 6.3,6.8 6.4,7.3 6,7 5.6,7.3 5.7,6.8 5.3,6.5 5.8,6.5" fill="#FFF"/><polygon points="4.5,8 4.7,8.5 5.2,8.5 4.8,8.8 4.9,9.3 4.5,9 4.1,9.3 4.2,8.8 3.8,8.5 4.3,8.5" fill="#FFF"/><rect width="24" height="24" fill="none" stroke="#000" stroke-opacity=".1" stroke-width=".5"/></svg>',
  // Somalia — light blue with white star
  'flag-so':
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><rect width="24" height="24" fill="#4189DD"/><polygon points="12,7 13,10 16,10 13.5,12 14.5,15 12,13 9.5,15 10.5,12 8,10 11,10" fill="#FFF"/><rect width="24" height="24" fill="none" stroke="#000" stroke-opacity=".1" stroke-width=".5"/></svg>',
  // South Africa — green Y on red / white / blue / black
  'flag-za':
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><rect width="24" height="8" fill="#E03C31"/><rect y="8" width="24" height="1" fill="#FFF"/><rect y="9" width="24" height="6" fill="#007749"/><rect y="15" width="24" height="1" fill="#FFF"/><rect y="16" width="24" height="8" fill="#001489"/><polygon points="0,0 10,12 0,24" fill="#000"/><polygon points="0,1 9,12 0,23" fill="#FFB81C"/><polygon points="0,2.5 7.5,12 0,21.5" fill="#007749"/><rect width="24" height="24" fill="none" stroke="#000" stroke-opacity=".1" stroke-width=".5"/></svg>',
  // South Sudan — black / red / green horizontal with blue triangle and star
  'flag-ss':
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><rect width="24" height="7" fill="#000"/><rect y="7" width="24" height="1" fill="#FFF"/><rect y="8" width="24" height="8" fill="#CE1126"/><rect y="16" width="24" height="1" fill="#FFF"/><rect y="17" width="24" height="7" fill="#078930"/><polygon points="0,0 12,12 0,24" fill="#0F47AF"/><polygon points="4,10.5 4.5,11.5 5.5,11.5 4.8,12.2 5.1,13.2 4,12.5 2.9,13.2 3.2,12.2 2.5,11.5 3.5,11.5" fill="#FCDD09"/><rect width="24" height="24" fill="none" stroke="#000" stroke-opacity=".1" stroke-width=".5"/></svg>',
  // Spain — red / yellow / red horizontal (yellow wider)
  'flag-es':
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><rect width="24" height="6" fill="#AA151B"/><rect y="6" width="24" height="12" fill="#F1BF00"/><rect y="18" width="24" height="6" fill="#AA151B"/><rect width="24" height="24" fill="none" stroke="#000" stroke-opacity=".1" stroke-width=".5"/></svg>',
  // Sri Lanka — maroon with gold lion, green / orange bars
  'flag-lk':
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><rect width="24" height="24" fill="#8D153A"/><rect width="3" height="24" fill="#F7941E"/><rect x="3" width="3" height="24" fill="#00534E"/><rect x="8" y="2" width="14" height="20" rx="1" fill="#8D153A" stroke="#FCB514" stroke-width=".8"/><path d="M15 8v6l-2-1v-4z" fill="#FCB514"/><rect width="24" height="24" fill="none" stroke="#000" stroke-opacity=".1" stroke-width=".5"/></svg>',
  // Sudan — red / white / black horizontal with green triangle
  'flag-sd':
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><rect width="24" height="8" fill="#D21034"/><rect y="8" width="24" height="8" fill="#FFF"/><rect y="16" width="24" height="8" fill="#000"/><polygon points="0,0 10,12 0,24" fill="#007229"/><rect width="24" height="24" fill="none" stroke="#000" stroke-opacity=".1" stroke-width=".5"/></svg>',
  // Suriname — green / white / red / white / green with yellow star
  'flag-sr':
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><rect width="24" height="5" fill="#377E3F"/><rect y="5" width="24" height="2" fill="#FFF"/><rect y="7" width="24" height="10" fill="#B40A2D"/><rect y="17" width="24" height="2" fill="#FFF"/><rect y="19" width="24" height="5" fill="#377E3F"/><polygon points="12,9 12.5,10.5 14,10.5 12.8,11.5 13.2,13 12,12 10.8,13 11.2,11.5 10,10.5 11.5,10.5" fill="#ECC81D"/><rect width="24" height="24" fill="none" stroke="#000" stroke-opacity=".1" stroke-width=".5"/></svg>',
  // Sweden — blue with yellow Scandinavian cross
  'flag-se':
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><rect width="24" height="24" fill="#004B87"/><rect y="10" width="24" height="4" fill="#FECC00"/><rect x="7" width="3" height="24" fill="#FECC00"/><rect width="24" height="24" fill="none" stroke="#000" stroke-opacity=".1" stroke-width=".5"/></svg>',
  // Switzerland — red with white cross
  'flag-ch':
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><rect width="24" height="24" fill="#FF0000"/><rect x="10" y="5" width="4" height="14" fill="#FFF"/><rect x="5" y="10" width="14" height="4" fill="#FFF"/><rect width="24" height="24" fill="none" stroke="#000" stroke-opacity=".1" stroke-width=".5"/></svg>',
  // Syria — red / white / black horizontal with green stars
  'flag-sy':
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><rect width="24" height="8" fill="#CE1126"/><rect y="8" width="24" height="8" fill="#FFF"/><rect y="16" width="24" height="8" fill="#000"/><polygon points="9,11 9.3,11.8 10.1,11.8 9.4,12.3 9.7,13.1 9,12.6 8.3,13.1 8.6,12.3 7.9,11.8 8.7,11.8" fill="#007A3D"/><polygon points="15,11 15.3,11.8 16.1,11.8 15.4,12.3 15.7,13.1 15,12.6 14.3,13.1 14.6,12.3 13.9,11.8 14.7,11.8" fill="#007A3D"/><rect width="24" height="24" fill="none" stroke="#000" stroke-opacity=".1" stroke-width=".5"/></svg>',

  // ── T ──────────────────────────────────────────────────────────────
  // Tajikistan — red / white / green horizontal with crown and stars
  'flag-tj':
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><rect width="24" height="7" fill="#CE1126"/><rect y="7" width="24" height="10" fill="#FFF"/><rect y="17" width="24" height="7" fill="#007A3D"/><path d="M11 10h2l.5-1.5h-3z" fill="#F8C300"/><polygon points="10,9 10.15,8.5 10.55,8.5 10.2,8.3 10.35,7.8 10,8 9.65,7.8 9.8,8.3 9.45,8.5 9.85,8.5" fill="#F8C300"/><polygon points="12,8 12.15,7.5 12.55,7.5 12.2,7.3 12.35,6.8 12,7 11.65,6.8 11.8,7.3 11.45,7.5 11.85,7.5" fill="#F8C300"/><polygon points="14,9 14.15,8.5 14.55,8.5 14.2,8.3 14.35,7.8 14,8 13.65,7.8 13.8,8.3 13.45,8.5 13.85,8.5" fill="#F8C300"/><rect width="24" height="24" fill="none" stroke="#000" stroke-opacity=".1" stroke-width=".5"/></svg>',
  // Tanzania — green / blue diagonal with yellow / black stripes
  'flag-tz':
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><polygon points="0,0 0,24 24,24" fill="#009E49"/><polygon points="0,0 24,0 24,24" fill="#00A3DD"/><polygon points="0,18 0,24 6,24 24,6 24,0 18,0" fill="#FCD116"/><polygon points="0,16 0,24 8,24 24,8 24,0 16,0" fill="#000"/><polygon points="0,14 0,24 10,24 24,10 24,0 14,0" fill="#FCD116"/><rect width="24" height="24" fill="none" stroke="#000" stroke-opacity=".1" stroke-width=".5"/></svg>',
  // Thailand — red / white / blue / white / red horizontal
  'flag-th':
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><rect width="24" height="4" fill="#ED1C24"/><rect y="4" width="24" height="4" fill="#FFF"/><rect y="8" width="24" height="8" fill="#241D4F"/><rect y="16" width="24" height="4" fill="#FFF"/><rect y="20" width="24" height="4" fill="#ED1C24"/><rect width="24" height="24" fill="none" stroke="#000" stroke-opacity=".1" stroke-width=".5"/></svg>',
  // Timor-Leste — red with black / yellow triangles and star
  'flag-tl':
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><rect width="24" height="24" fill="#DC241F"/><polygon points="0,0 14,12 0,24" fill="#000"/><polygon points="0,0 10,12 0,24" fill="#FFC726"/><polygon points="4,10 4.5,11.5 6,11.5 4.8,12.5 5.2,14 4,13 2.8,14 3.2,12.5 2,11.5 3.5,11.5" fill="#FFF"/><rect width="24" height="24" fill="none" stroke="#000" stroke-opacity=".1" stroke-width=".5"/></svg>',
  // Togo — green / yellow stripes with red canton and white star
  'flag-tg':
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><rect width="24" height="4.8" fill="#006A4E"/><rect y="4.8" width="24" height="4.8" fill="#FFCE00"/><rect y="9.6" width="24" height="4.8" fill="#006A4E"/><rect y="14.4" width="24" height="4.8" fill="#FFCE00"/><rect y="19.2" width="24" height="4.8" fill="#006A4E"/><rect width="10" height="9.6" fill="#D21034"/><polygon points="5,3 5.5,4.5 7,4.5 5.8,5.5 6.2,7 5,6 3.8,7 4.2,5.5 3,4.5 4.5,4.5" fill="#FFF"/><rect width="24" height="24" fill="none" stroke="#000" stroke-opacity=".1" stroke-width=".5"/></svg>',
  // Tonga — red with white canton containing red cross
  'flag-to':
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><rect width="24" height="24" fill="#C10000"/><rect width="10" height="10" fill="#FFF"/><rect x="3.5" y="2" width="3" height="6" fill="#C10000"/><rect x="2" y="3.5" width="6" height="3" fill="#C10000"/><rect width="24" height="24" fill="none" stroke="#000" stroke-opacity=".1" stroke-width=".5"/></svg>',
  // Trinidad and Tobago — red with black diagonal stripe
  'flag-tt':
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><rect width="24" height="24" fill="#CE1126"/><polygon points="2,0 0,0 0,2 22,24 24,24 24,22" fill="#FFF"/><polygon points="4,0 0,0 0,4 20,24 24,24 24,20" fill="#000"/><polygon points="6,0 0,0 0,6 18,24 24,24 24,18" fill="#FFF"/><rect width="24" height="24" fill="none" stroke="#000" stroke-opacity=".1" stroke-width=".5"/></svg>',
  // Tunisia — red with white circle and crescent/star
  'flag-tn':
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><rect width="24" height="24" fill="#E70013"/><circle cx="12" cy="12" r="5" fill="#FFF"/><circle cx="11.5" cy="12" r="3.5" fill="#E70013"/><circle cx="12.5" cy="12" r="2.8" fill="#FFF"/><circle cx="12" cy="12" r="3" fill="none"/><circle cx="11.8" cy="12" r="3.2" fill="#E70013"/><circle cx="12.8" cy="12" r="2.5" fill="#FFF"/><polygon points="14,12 13.5,11 14.5,11.6 13.3,11.6 14.3,11" fill="#E70013"/><rect width="24" height="24" fill="none" stroke="#000" stroke-opacity=".1" stroke-width=".5"/></svg>',
  // Turkey — red with white crescent and star
  'flag-tr':
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><rect width="24" height="24" fill="#E30A17"/><circle cx="9.5" cy="12" r="4" fill="#FFF"/><circle cx="10.5" cy="12" r="3.2" fill="#E30A17"/><polygon points="15,12 14.2,10.5 16,11.5 13.8,11.5 15.6,10.5" fill="#FFF"/><rect width="24" height="24" fill="none" stroke="#000" stroke-opacity=".1" stroke-width=".5"/></svg>',
  // Turkmenistan — green with red/white vertical stripe and crescent/stars
  'flag-tm':
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><rect width="24" height="24" fill="#00843D"/><rect x="4" width="5" height="24" fill="#AC1F3A"/><rect x="4.5" y="1" width="4" height="3" fill="#FFF" fill-opacity=".4"/><rect x="4.5" y="5" width="4" height="3" fill="#FFF" fill-opacity=".4"/><rect x="4.5" y="9" width="4" height="3" fill="#FFF" fill-opacity=".4"/><rect x="4.5" y="13" width="4" height="3" fill="#FFF" fill-opacity=".4"/><rect x="4.5" y="17" width="4" height="3" fill="#FFF" fill-opacity=".4"/><circle cx="15" cy="7" r="2.5" fill="#FFF"/><circle cx="16" cy="7" r="2" fill="#00843D"/><polygon points="18,4 18.2,4.5 18.7,4.5 18.3,4.8 18.4,5.3 18,5 17.6,5.3 17.7,4.8 17.3,4.5 17.8,4.5" fill="#FFF"/><rect width="24" height="24" fill="none" stroke="#000" stroke-opacity=".1" stroke-width=".5"/></svg>',
  // Tuvalu — light blue with Union Jack canton and yellow stars
  'flag-tv':
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><rect width="24" height="24" fill="#009FCA"/><rect width="12" height="12" fill="#012169"/><path d="M0 0l12 12M12 0L0 12" stroke="#FFF" stroke-width="2"/><path d="M0 0l12 12M12 0L0 12" stroke="#C8102E" stroke-width="1"/><rect y="5" width="12" height="2" fill="#FFF"/><rect x="5" width="2" height="12" fill="#FFF"/><rect y="5.4" width="12" height="1.2" fill="#C8102E"/><rect x="5.4" width="1.2" height="12" fill="#C8102E"/><polygon points="16,14 16.2,14.5 16.7,14.5 16.3,14.8 16.4,15.3 16,15 15.6,15.3 15.7,14.8 15.3,14.5 15.8,14.5" fill="#FFE900"/><polygon points="20,14 20.2,14.5 20.7,14.5 20.3,14.8 20.4,15.3 20,15 19.6,15.3 19.7,14.8 19.3,14.5 19.8,14.5" fill="#FFE900"/><polygon points="18,17 18.2,17.5 18.7,17.5 18.3,17.8 18.4,18.3 18,18 17.6,18.3 17.7,17.8 17.3,17.5 17.8,17.5" fill="#FFE900"/><polygon points="16,20 16.2,20.5 16.7,20.5 16.3,20.8 16.4,21.3 16,21 15.6,21.3 15.7,20.8 15.3,20.5 15.8,20.5" fill="#FFE900"/><polygon points="20,20 20.2,20.5 20.7,20.5 20.3,20.8 20.4,21.3 20,21 19.6,21.3 19.7,20.8 19.3,20.5 19.8,20.5" fill="#FFE900"/><rect width="24" height="24" fill="none" stroke="#000" stroke-opacity=".1" stroke-width=".5"/></svg>',

  // ── U ──────────────────────────────────────────────────────────────
  // Uganda — black / yellow / red horizontal ×2 with white circle
  'flag-ug':
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><rect width="24" height="4" fill="#000"/><rect y="4" width="24" height="4" fill="#FCDC04"/><rect y="8" width="24" height="4" fill="#D90000"/><rect y="12" width="24" height="4" fill="#000"/><rect y="16" width="24" height="4" fill="#FCDC04"/><rect y="20" width="24" height="4" fill="#D90000"/><circle cx="12" cy="12" r="3" fill="#FFF"/><circle cx="12" cy="12" r="1.5" fill="#9CA69C"/><rect width="24" height="24" fill="none" stroke="#000" stroke-opacity=".1" stroke-width=".5"/></svg>',
  // Ukraine — blue / yellow horizontal bicolor
  'flag-ua':
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><rect width="24" height="12" fill="#005BBB"/><rect y="12" width="24" height="12" fill="#FFD500"/><rect width="24" height="24" fill="none" stroke="#000" stroke-opacity=".1" stroke-width=".5"/></svg>',
  // United Arab Emirates — green / white / black horizontal with red vertical
  'flag-ae':
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><rect width="24" height="8" fill="#00732F"/><rect y="8" width="24" height="8" fill="#FFF"/><rect y="16" width="24" height="8" fill="#000"/><rect width="6" height="24" fill="#FF0000"/><rect width="24" height="24" fill="none" stroke="#000" stroke-opacity=".1" stroke-width=".5"/></svg>',
  // United Kingdom — Union Jack
  'flag-gb':
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><rect width="24" height="24" fill="#012169"/><path d="M0 0l24 24M24 0L0 24" stroke="#FFF" stroke-width="4"/><path d="M0 0l24 24" stroke="#C8102E" stroke-width="1.5" transform="translate(0.5,0)"/><path d="M24 0L0 24" stroke="#C8102E" stroke-width="1.5" transform="translate(-0.5,0)"/><rect y="10" width="24" height="4" fill="#FFF"/><rect x="10" width="4" height="24" fill="#FFF"/><rect y="10.5" width="24" height="3" fill="#C8102E"/><rect x="10.5" width="3" height="24" fill="#C8102E"/><rect width="24" height="24" fill="none" stroke="#000" stroke-opacity=".1" stroke-width=".5"/></svg>',
  // United States — stars and stripes
  'flag-us':
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><rect width="24" height="24" fill="#FFF"/><rect width="24" height="1.85" fill="#B22234"/><rect y="3.69" width="24" height="1.85" fill="#B22234"/><rect y="7.38" width="24" height="1.85" fill="#B22234"/><rect y="11.08" width="24" height="1.85" fill="#B22234"/><rect y="14.77" width="24" height="1.85" fill="#B22234"/><rect y="18.46" width="24" height="1.85" fill="#B22234"/><rect y="22.15" width="24" height="1.85" fill="#B22234"/><rect width="10" height="12.92" fill="#3C3B6E"/><circle cx="2" cy="1.5" r=".5" fill="#FFF"/><circle cx="4" cy="1.5" r=".5" fill="#FFF"/><circle cx="6" cy="1.5" r=".5" fill="#FFF"/><circle cx="8" cy="1.5" r=".5" fill="#FFF"/><circle cx="3" cy="3" r=".5" fill="#FFF"/><circle cx="5" cy="3" r=".5" fill="#FFF"/><circle cx="7" cy="3" r=".5" fill="#FFF"/><circle cx="2" cy="4.5" r=".5" fill="#FFF"/><circle cx="4" cy="4.5" r=".5" fill="#FFF"/><circle cx="6" cy="4.5" r=".5" fill="#FFF"/><circle cx="8" cy="4.5" r=".5" fill="#FFF"/><circle cx="3" cy="6" r=".5" fill="#FFF"/><circle cx="5" cy="6" r=".5" fill="#FFF"/><circle cx="7" cy="6" r=".5" fill="#FFF"/><circle cx="2" cy="7.5" r=".5" fill="#FFF"/><circle cx="4" cy="7.5" r=".5" fill="#FFF"/><circle cx="6" cy="7.5" r=".5" fill="#FFF"/><circle cx="8" cy="7.5" r=".5" fill="#FFF"/><circle cx="3" cy="9" r=".5" fill="#FFF"/><circle cx="5" cy="9" r=".5" fill="#FFF"/><circle cx="7" cy="9" r=".5" fill="#FFF"/><circle cx="2" cy="10.5" r=".5" fill="#FFF"/><circle cx="4" cy="10.5" r=".5" fill="#FFF"/><circle cx="6" cy="10.5" r=".5" fill="#FFF"/><circle cx="8" cy="10.5" r=".5" fill="#FFF"/><circle cx="3" cy="12" r=".5" fill="#FFF"/><circle cx="5" cy="12" r=".5" fill="#FFF"/><circle cx="7" cy="12" r=".5" fill="#FFF"/><rect width="24" height="24" fill="none" stroke="#000" stroke-opacity=".1" stroke-width=".5"/></svg>',
  // Uruguay — white / blue stripes with sun in canton
  'flag-uy':
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><rect width="24" height="24" fill="#FFF"/><rect y="2.67" width="24" height="2.67" fill="#0038A8"/><rect y="8" width="24" height="2.67" fill="#0038A8"/><rect y="13.33" width="24" height="2.67" fill="#0038A8"/><rect y="18.67" width="24" height="2.67" fill="#0038A8"/><rect width="9" height="10.67" fill="#FFF"/><circle cx="4.5" cy="5.3" r="2" fill="#FFC72C"/><circle cx="4.5" cy="5.3" r="1.3" fill="#FFF"/><circle cx="4.5" cy="5.3" r=".8" fill="#FFC72C"/><rect width="24" height="24" fill="none" stroke="#000" stroke-opacity=".1" stroke-width=".5"/></svg>',
  // Uzbekistan — blue / white / green with red stripes and crescent/stars
  'flag-uz':
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><rect width="24" height="7" fill="#0099B5"/><rect y="7" width="24" height="1" fill="#CE1126"/><rect y="8" width="24" height="8" fill="#FFF"/><rect y="16" width="24" height="1" fill="#CE1126"/><rect y="17" width="24" height="7" fill="#1EB53A"/><circle cx="5" cy="3.5" r="2" fill="#FFF"/><circle cx="5.8" cy="3.5" r="1.5" fill="#0099B5"/><rect width="24" height="24" fill="none" stroke="#000" stroke-opacity=".1" stroke-width=".5"/></svg>',

  // ── V ──────────────────────────────────────────────────────────────
  // Vanuatu — red / green with black triangle and Y
  'flag-vu':
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><polygon points="0,0 24,0 24,12 12,12 0,0" fill="#D21034"/><polygon points="0,24 24,24 24,12 12,12 0,24" fill="#009543"/><polygon points="0,0 12,12 0,24" fill="#000"/><path d="M0,3 10,12 0,21" fill="none" stroke="#FCD116" stroke-width="2"/><rect width="24" height="24" fill="none" stroke="#000" stroke-opacity=".1" stroke-width=".5"/></svg>',
  // Vatican City — gold / white vertical with keys
  'flag-va':
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><rect width="12" height="24" fill="#FFE000"/><rect x="12" width="12" height="24" fill="#FFF"/><circle cx="18" cy="10" r="1.5" fill="#FFE000"/><path d="M17 12v4M19 12v4M16 14h1M19 14h1" stroke="#8B0000" stroke-width=".5"/><rect width="24" height="24" fill="none" stroke="#000" stroke-opacity=".1" stroke-width=".5"/></svg>',
  // Venezuela — yellow / blue / red horizontal with stars
  'flag-ve':
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><rect width="24" height="8" fill="#FFCC00"/><rect y="8" width="24" height="8" fill="#003DA5"/><rect y="16" width="24" height="8" fill="#D82B2B"/><path d="M8 11l.5-.5M10 10.5l.5-.5M12 10.5l0 0M14 10.5l-.5-.5M16 11l-.5-.5" fill="none" stroke="#FFF" stroke-width=".5"/><circle cx="9" cy="11" r=".4" fill="#FFF"/><circle cx="11" cy="10.5" r=".4" fill="#FFF"/><circle cx="13" cy="10.5" r=".4" fill="#FFF"/><circle cx="15" cy="11" r=".4" fill="#FFF"/><circle cx="12" cy="11.5" r=".4" fill="#FFF"/><circle cx="10" cy="12" r=".4" fill="#FFF"/><circle cx="14" cy="12" r=".4" fill="#FFF"/><circle cx="12" cy="13" r=".4" fill="#FFF"/><rect width="24" height="24" fill="none" stroke="#000" stroke-opacity=".1" stroke-width=".5"/></svg>',
  // Vietnam — red with yellow star
  'flag-vn':
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><rect width="24" height="24" fill="#DA251D"/><polygon points="12,6 13.2,9.5 17,9.5 14,11.5 15,15 12,13 9,15 10,11.5 7,9.5 10.8,9.5" fill="#FFCD00"/><rect width="24" height="24" fill="none" stroke="#000" stroke-opacity=".1" stroke-width=".5"/></svg>',

  // ── W ──────────────────────────────────────────────────────────────

  // ── Y ──────────────────────────────────────────────────────────────
  // Yemen — red / white / black horizontal tricolor
  'flag-ye':
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><rect width="24" height="8" fill="#CE1126"/><rect y="8" width="24" height="8" fill="#FFF"/><rect y="16" width="24" height="8" fill="#000"/><rect width="24" height="24" fill="none" stroke="#000" stroke-opacity=".1" stroke-width=".5"/></svg>',

  // ── Z ──────────────────────────────────────────────────────────────
  // Zambia — green with eagle and tricolor stripe
  'flag-zm':
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><rect width="24" height="24" fill="#198A00"/><rect x="15" y="12" width="3" height="12" fill="#EF7D00"/><rect x="18" y="12" width="3" height="12" fill="#000"/><rect x="21" y="12" width="3" height="12" fill="#DE2010"/><path d="M18 6l-2 3h4z" fill="#EF7D00"/><rect width="24" height="24" fill="none" stroke="#000" stroke-opacity=".1" stroke-width=".5"/></svg>',
  // Zimbabwe — 7 stripes with white triangle, red star, and bird
  'flag-zw':
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><rect width="24" height="3.43" fill="#319208"/><rect y="3.43" width="24" height="3.43" fill="#FFD200"/><rect y="6.86" width="24" height="3.43" fill="#DE2010"/><rect y="10.29" width="24" height="3.43" fill="#000"/><rect y="13.71" width="24" height="3.43" fill="#DE2010"/><rect y="17.14" width="24" height="3.43" fill="#FFD200"/><rect y="20.57" width="24" height="3.43" fill="#319208"/><polygon points="0,0 10,12 0,24" fill="#FFF"/><polygon points="0,1 9,12 0,23" fill="#FFF"/><polygon points="5,10 5.4,11 6.3,11 5.5,11.6 5.8,12.5 5,12 4.2,12.5 4.5,11.6 3.7,11 4.6,11" fill="#DE2010"/><rect width="24" height="24" fill="none" stroke="#000" stroke-opacity=".1" stroke-width=".5"/></svg>',

  // ── Extra: Key entities & territories ───────────────────────────────
  // European Union — blue with 12 gold stars
  'flag-eu':
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><rect width="24" height="24" fill="#003399"/><circle cx="12" cy="4" r=".7" fill="#FFCC00"/><circle cx="16" cy="5" r=".7" fill="#FFCC00"/><circle cx="19" cy="8" r=".7" fill="#FFCC00"/><circle cx="20" cy="12" r=".7" fill="#FFCC00"/><circle cx="19" cy="16" r=".7" fill="#FFCC00"/><circle cx="16" cy="19" r=".7" fill="#FFCC00"/><circle cx="12" cy="20" r=".7" fill="#FFCC00"/><circle cx="8" cy="19" r=".7" fill="#FFCC00"/><circle cx="5" cy="16" r=".7" fill="#FFCC00"/><circle cx="4" cy="12" r=".7" fill="#FFCC00"/><circle cx="5" cy="8" r=".7" fill="#FFCC00"/><circle cx="8" cy="5" r=".7" fill="#FFCC00"/><rect width="24" height="24" fill="none" stroke="#000" stroke-opacity=".1" stroke-width=".5"/></svg>',
  // Hong Kong — red with white bauhinia
  'flag-hk':
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><rect width="24" height="24" fill="#DE2110"/><circle cx="12" cy="12" r="4" fill="#FFF" fill-opacity=".15"/><path d="M12 8c0 2-1.5 3-3 4 2 0 3 1.5 4 3 0-2 1.5-3 3-4-2 0-3-1.5-4-3z" fill="#FFF"/><circle cx="12" cy="12" r="1" fill="#FFF"/><rect width="24" height="24" fill="none" stroke="#000" stroke-opacity=".1" stroke-width=".5"/></svg>',
  // Taiwan — red with blue canton and white sun
  'flag-tw':
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><rect width="24" height="24" fill="#FE0000"/><rect width="12" height="12" fill="#000095"/><circle cx="6" cy="6" r="3" fill="#FFF"/><circle cx="6" cy="6" r="2" fill="#000095"/><circle cx="6" cy="6" r="1" fill="#FFF"/><rect width="24" height="24" fill="none" stroke="#000" stroke-opacity=".1" stroke-width=".5"/></svg>',
  // Puerto Rico — blue / white stripes with red triangle and white star
  'flag-pr':
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><rect width="24" height="4.8" fill="#FFF"/><rect y="4.8" width="24" height="4.8" fill="#3C3B6E"/><rect y="9.6" width="24" height="4.8" fill="#FFF"/><rect y="14.4" width="24" height="4.8" fill="#3C3B6E"/><rect y="19.2" width="24" height="4.8" fill="#FFF"/><polygon points="0,0 12,12 0,24" fill="#CE1126"/><polygon points="4,10.5 4.5,11.5 5.5,11.5 4.7,12.2 5,13.2 4,12.5 3,13.2 3.3,12.2 2.5,11.5 3.5,11.5" fill="#FFF"/><rect width="24" height="24" fill="none" stroke="#000" stroke-opacity=".1" stroke-width=".5"/></svg>',
  // Kosovo — blue with gold map and stars
  'flag-xk':
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><rect width="24" height="24" fill="#244AA5"/><ellipse cx="12" cy="13" rx="3" ry="4" fill="#D0A650"/><circle cx="8" cy="5" r=".5" fill="#FFF"/><circle cx="10" cy="4" r=".5" fill="#FFF"/><circle cx="12" cy="3.5" r=".5" fill="#FFF"/><circle cx="14" cy="4" r=".5" fill="#FFF"/><circle cx="16" cy="5" r=".5" fill="#FFF"/><circle cx="13" cy="6" r=".5" fill="#FFF"/><rect width="24" height="24" fill="none" stroke="#000" stroke-opacity=".1" stroke-width=".5"/></svg>',
};
