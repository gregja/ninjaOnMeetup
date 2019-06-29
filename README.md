# ninjaOnMeetup
A small demo for the Creative Code paris Exhibition 2019

De septembre 2018 à mai 2019, au meetup CreativeCodeParis, nous avons organisé
des soirées coding, au rythme d'une fois par mois, et un mois sur deux.
Nous avons intitulé ces soirées coding des "code kitchen". A chaque nouvelle
soirée, les participants proposaient des thèmes et on en tirait 3 ou 4 au hasard,
à charge pour chacun(e) de choisir son thème de prédilection, et de le développer
à sa manière, avec les outils (de programmation) de son choix.

Nous avions pour objectif d'organiser en juin 2019 une exposition des travaux
réalisés durant les "code kitchen", et nous avons réalisé cette exposition le
jeudi 20 juin, à la Folie Numérique.

Pendant l'une des "code kitchen", j'avais proposé le thème de la "perte d'identité",
venant de lire le roman de Philip K. Dick dont le titre français est "Substance mort"
(titre original : "A Scanner Darkly").

Pour ma présentation du 20 juin, j'ai eu envie de me replonger dans de vieux
algorithmes de traitement d'image 2D, vieux parce que pour certains écrits il
y a plus de 30 ans, dans des langages comme Basic et Pascal. Le challenge
pour moi consistait à les adapter en Javascript en utilisant au maximum les
possibilités de l'API Canvas du HTML5.

J'ai utilisé comme protagoniste de ma présentation, un chat que je connais bien,
il s'appelle Ninja. J'ai prétexté que Ninja souffrait de trouble de la
personnalité et avait l'impression de perdre son identité.

-------------------------

A noter : vous trouverez dans le répertoire "snapshots" de ce dépôt, quelques
copies d'écran relatives aux effets décrits ci-dessous.

-------------------------

La photo de Ninja est tout d'abord chargée au moyen d'une Promise. Cette
technique apparue en 2015 avec la norme ES6 de Javascript, offre l'énorme
avantage d'exécuter des tâches de manière asynchrone, c'est à dire sans bloquer
le thread principal. Dans le cas du chargement d'une image, cela se traduit par
le code suivant

```javascript
var asset = {name: "ninja", path:"images/ninja2.jpg"};

function loadImage (asset) {
  return new Promise((resolve) => {
    canvas.classList.add('animated', 'fadeOut')
    let img = new Image();
    img.setAttribute('data-name', asset.name);
    img.crossOrigin = "Anonymous";
    img.onload = () => resolve(img);
    img.src = asset.path;
  })
}

loadImage(asset).then(image => {
    // get the size of the image loaded
    var w = image.width;
    var h = image.height;
    // adjust the size of the canvas to the size of the image loaded
    canvas.width = w;
    canvas.height = h;
    // draw the image into the canvas
    ctx.drawImage(image, 0, 0, w, h);
    /*  ... do what you want here ...  */
})

```

Cette technique de chargement d'image est vraiment très pratique.
Je n'en ai pas eu besoin ici, mais il faut savoir que l'on peut aussi utiliser
les Promises pour charger plusieur images de manière asynchrone, et lancer une action spécifique
(comme le démarrage d'un tableau de jeu), une fois que toutes les images sont
chargées, c'est à dire une fois que toutes les Promises sont terminées.
Concrètement, on charge toutes les Promises dans un tableau Javascript, et on lance
la fonction Promise.all() pour détecter le moment où toutes les Promises sont finies.

Voici un exemple de mise en application :

```javascript
function loadImages (src) {
    let pics = [];
    src.forEach((item) => {
        pics.push(new Promise((resolve) => {
            let img = new Image();
            img.setAttribute('data-name', item.name);
            img.crossOrigin = "Anonymous";
            img.onload = () => resolve(img);
            img.src = item.path;
        }));
    });
    return Promise.all(pics);
}
```

J'adore cette technique, que j'avais déjà expérimentée dans le projet suivant :
https://github.com/gregja/parallax_processing/

----------------

L'effet que j'avais souhaité implémenter sur la première page (index.html)  
consistait à splitter l'image en plusieurs images plus petites, en redisposant
les pixels de l'image d'origine, tel qu'expliqué ci-dessous :

Prendre une image de X sur Y pixels et recomposer ses pixels pairs et impairs
en 4 photos, selon la répartition suivante :
```javascript
          Pairs ! Pairs
----------------------------------
   Pairs  !  1  !  2  ! Impairs
----------!-----!-----!-----------
   Pairs  !  3  !  4  ! Impairs
----------------------------------
        Impairs ! Impairs
```
Explication :
L’écran graphique est décomposé en 4 zones de taille égale composées comme suit :
La zone 1 est composée des pixels horizontaux et verticaux de numéro pair
(0, 2, 4, etc...). La zone 2 est composée des pixels horizontaux pairs et
verticaux impairs. Pour la zone 3 la répartition est inverse de la zone 2.
Enfin, la zone 4 est composée des pixels horizontaux et verticaux impairs.

Dans la démo, j'ai utilisé les touches du clavier 1 à 9 pour répéter l'opération
plusieurs fois, et aboutir à une image dans laquel Ninja devient méconnaissable.

La touche "P" permet d'appliquer un effet de type "posterize" à la photo.
J'avais trouvé cet algorithme sur internet, et je l'avais mis de côté en
attendant de trouver une opportunité de le tester... c'est chose faite, et
je trouve l'effet plutôt réussi.

---------------------

Effet de transition : quand on réalise une démo, par exemple pour un hackaton,
on est souvent pris par le temps et on a rarement le temps de travailler sur les
finitions. Parmi ces finitions, il y a les effets de transition entre plusieurs
scènes.
Les spectateurs sont en effet habitués à des changements de plan accompagnés d'un
effet plus ou moins discret, il est donc souhaitable de faire de même.
Je me suis dès lors posé la question de savoir comment je pourrais programmer ces
effet de transition, que je souhaitais discrets. J'avais plusieurs solutions à
ma disposition, telles que :
- programmer un effet directement sur le canvas dans lequel est réalisée la démo
 (tout à fait faisable, mais cela peut compliquer la programmation de la démo,
   car il faut penser à gérer une notion d'état)
- programmer l'effet sur un canvas différent placé au dessus du canvas de démo,
 (cette seconde solution est plus simple à réaliser mais nécessite néanmoins un
   travail de mise au point, et dans un hackaton on n'a pas toujours le temps
   suffisant pour ça)
- programmer l'effet de transition en utilisant du CSS3, et donc sans toucher
 au canvas

La solution de la norme CSS3 est très intéressante, d'autant qu'elle contient de nombreux
effets de transformation qui sont relativement faciles à mettre en oeuvre (mais
ils nécessitent une bonne connaissance de CSS3 et un peu de pratique). En plus
les effets fournis par CSS3 sont prêts à l'emploi, pas besoin de les programmer
vous même (il faut juste les paramétrer correctement), c'est un sacré gain de
temps sachant que la programmation d'effets visuels peut vite devenir complexe
et surtout chronophage.

J'ai découvert récemment un petit framework CSS, qui s'appelle "Animate.css",
et qui propose une palette d'effets CSS3 prêts à l'emploi. Cela simplifie
un peu plus l'utilisation de CSS3, quand on n'est pas à l'aise avec le sujet,
ou que l'on est pris par le temps (comme dans un hackaton par exemple).

C'est l'un des effets (fadein/fadeout) de "Animate.css" que j'ai utilisé ici.

Lien vers le projet Animate.css :

https://daneden.github.io/animate.css/

Solution concurrente de Animate.css, non testée faute de temps, mais qui semble
très intéressante car elle propose de nombreux paramétrages, c'est Animista :

http://animista.net/play/

Si vous n'êtes pas à l'aise avec CSS3, vous pouvez l'étudier au travers du
support de cours que j'ai mis en téléchargement libre sur ce dépôt :

https://github.com/gregja/JSCorner

-----------------

A noter que pour le passage d'une scène à l'autre (en réalité d'une page à
l'autre), j'ai utilisé un raccourci clavier, avec la touche "X".

------------------

La manipulation des pixels du canvas implique de savoir adresser précisément
chaque pixel grâce à ses coordonnées X et Y. L'API Canvas ne fournit pas de
fonctions permettant de travailler au pixel près, mais on peut facilement
combler ce manque avec les fonctions suivants :

```javascript
const rgbToHex = (r, g, b) => {
  return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
}

const getPixel = function (context, x, y) {
    let imageData = context.getImageData( x, y, 1, 1 );
    let data = imageData.data;
    return rgbToHex(data[ 0 ], data[ 1 ], data[ 2 ]);
}

const setPixel = function(context, x, y, r, g, b, a ) {
    let imageData = context.getImageData( x, y, 1, 1 );
    let data = imageData.data;
    let i = ( x + y * imageData.width ) * 4;
    data[ i ] = r;
    data[ i + 1 ] = g;
    data[ i + 2 ] = b;
    data[ i + 3 ] = a;
}
```
J'ai utilisé des variantes légèrement optimisées des fonctions ci-dessus
dans le code de cette démo.

---------------------

Sur la page "ninja_bubbles.html", j'ai superposé deux canvas, l'un servant de
fond et contenant la photo de Ninja (chargée là encore au moyen d'une Promise),
le second canvas, transparent, placé juste au dessus du précédent, me permet
d'afficher des bulles générées par un algorithme de gestion de particules
trouvé sur internet (cf. lien d'origine dans le code de la classe Particle).

Un effet très simple, associé à la variable "flag_kill_bubbles" me permet de
faire disparaître les bulles de manière progressive, quand on presse la touche "Q".

La pression de la touche "X" permet de passer à la dernière page "ninja_3dworld.html",
mais je ne m'en suis pas servi, car le chargement de cette dernière page est un
peu lent, je l'avais donc préchargée et j'ai basculé sur cette page via la
combinaison de touches Ctrl+Tabulation.

------------------------

Dans la page "ninja_3dworld.html", je charge une photo de Ninja (toujours via
une Promise), j'extrais les couleurs de chaque pixel et me sers de ces couleurs
pour générer des cynlindres 3D, de même couleur, et en me servant de cette
couleur pour moduler la hauteut de chaque cylindre (plus c'est clair, plus c'est haut).
L'effet 3D est obtenu grâce au framework Aframe. Ce framework est développé par
Mozilla, il est dédié à la création de scènes de réalité virtuelle, mais on peut
l'utiliser pour un usage plus large.

J'avais effectué une présentation de AFrame en juin 2018 à la Folie Numérique.
Le dépôt suivant contient le support de ma présentation ainsi que tous les
exemples :
https://github.com/gregja/AFramePrez

Lors de cette présentation, j'avais réalisé un effet similaire à celui effectué
sur Ninja, mais sur une fractale calculée dynamiquement (c'était un peu lent).
Sur la photo de Ninja, c'est beaucoup plus fluide, mais j'ai dû raccourcir la
photo pour ne pas générer trop de cylindres et conserver une bonne fluidité.

Pendant la démo, je repositionne la photo de Ninja à la souris, et je zoome via
les touches flèche du clavier.

La pression de la touche "X" permet de basculer sur une dernière page.

------------------

La dernière page (ninja_happy.html) affiche une photo sans aucun effet. Je l'ai ajoutée
un peu à la dernière minute, car je trouve cette posture de Ninja - en train de dormir -
particulièrement amusante.

-------------------

Besoin d'un serveur web ?

Pour une démo aussi simple que celle-ci, basée exclusivement sur du code Javascript
"front" (pour navigateur), un serveur web n'est pas utile.

Mais dans des cas comme celui-ci, j'utilise volontiers NodeJS et le package
http-server. Il permet de mettre en route un serveur web minimaliste :

https://www.npmjs.com/package/http-server

L'installation est très simple, et on peut faire cohabiter plusieurs serveurs
webs démarrés avec ce même package, il suffit pour cela de se mettre dans le
répertoire correspondant à chaque projet, et de lancer la commande "http-server".
Chaque instance démarrée se verra attribuer un port distinct (8080, 8081, etc.),
c'est très pratique.

On peut aussi démarrer un mini-serveur Node en lançant le script "mininode.js",
de la façon suivante :

node mininode.js

C'est un script très simple que j'avais trouvé sur une page de MDN (Mozilla), je
vous l'ai mis dans le dépôt pour l'exemple, car je n'ai pas retrouvé le lien
de la page d'origine.

Si vous avez besoin pour votre projet créatif d'un serveur de niveau plus avancé,
nécessitant des échanges fréquents entre le navigateur et le serveur, vous pouvez
vous tourner vers le framework Express pour Node.js.

J'ai rédigé un support de cours assez complet sur Node et Express, que vous
pouvez récupérer dans ce dépôt si le sujet vous intéresse :

https://github.com/gregja/NodeJSCorner


-------------------

J'espère que le code source de cette démo, accompagné de ces explications un
peu rapides, pourra vous aider dans la réalisation de vos projets créatifs.

Au plaisir de vous retrouver bientôt à :

https://www.meetup.com/fr-FR/CreativeCodeParis/
