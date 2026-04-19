import i18n from 'i18next';
import quotesData from './quotes.json';

export const MOOD_CONFIG = {
  happy: {
    color: '#FFF9C4',
    icon: require('../../assets/images/happy.svg'),
    phrases: {
      es: [
        "Disfruta este momento de plenitud, te mereces sentir esta alegría que inunda tu día.",
        "Recuerda que no tienes que forzar la felicidad constante para ser válido; hoy simplemente te acompaña.",
        "Aprovecha esta energía luminosa para conectar con las cosas que realmente te llenan el alma."
      ],
      ca: [
        "Gaudeix aquest moment de plenitud, et mereixes sentir aquesta alegria que inunda el teu dia.",
        "Recorda que no has de forçar la felicitat constant per ser vàlid; avui simplement t'acompanya.",
        "Aprofita aquesta energia lluminosa per connectar amb les coses que realment t'omplen l'ànima."
      ],
      en: [
        "Enjoy this moment of fulfillment; you deserve to feel this joy flooding your day.",
        "Remember you don't have to force constant happiness to be worthy; today it simply follows you.",
        "Use this luminous energy to connect with the things that truly fill your soul."
      ],
      fr: [
        "Profitez de ce moment de plénitude ; vous méritez de ressentir cette joie qui inonde votre journée.",
        "Rappelez-vous que vous n'avez pas à forcer le bonheur pour être valable ; aujourd'hui, il vous accompagne.",
        "Profitez de cette énergie lumineuse pour vous connecter aux choses qui vous remplissent l'âme."
      ]
    }
  },
  glad: {
    color: '#F9E79F',
    icon: require('../../assets/images/glad.svg'),
    phrases: {
      es: [
        "Estar bien es más que suficiente; valora esta tranquilidad que te permite respirar hondo.",
        "Sentirse bien ya es una victoria silenciosa; apreciar este equilibrio es una forma de autocuidado.",
        "Disfruta de la calma de un día sin sobresaltos donde todo fluye de manera natural."
      ],
      ca: [
        "Estar bé és més que suficient; valora aquesta tranquil·litat que et permet respirar fons.",
        "Sentir-se bé ja és una victòria silenciosa; apreciar aquest equilibri és una forma d'autocura.",
        "Gaudeix de la calma d'un dia sense ensurts on tot flueix de manera natural."
      ],
      en: [
        "Being well is more than enough; value this tranquility that allows you to take a deep breath.",
        "Feeling good is already a silent victory; appreciating this balance is a form of self-care.",
        "Enjoy the calm of a steady day where everything flows naturally."
      ],
      fr: [
        "Être bien est amplement suffisant ; appréciez cette tranquillité qui vous permet de respirer profondément.",
        "Se sentir bien est déjà une victoire silencieuse ; apprécier cet équilibre est une forme de soin de soi.",
        "Profitez du calme d'une journée sans heurts où tout coule naturellement."
      ]
    }
  },
  excited: {
    color: '#FAD7A0',
    icon: require('../../assets/images/excited.svg'),
    phrases: {
      es: [
        "Es emocionante sentir estas ganas de comerte el mundo, deja que esa fuerza te impulse.",
        "No pasa nada por estar acelerado; es la ilusión del momento manifestándose en tu cuerpo.",
        "Disfruta de la chispa creativa que sientes ahora, pero recuerda respirar para no agotarte."
      ],
      ca: [
        "És emocionant sentir aquestes ganes de menjar-te el món, deixa que aquesta força t'impulsi.",
        "No passa res per estar accelerat; és la il·lusió del moment manifestant-se en el teu cos.",
        "Gaudeix de l'espurna creativa que sents ara, però recorda respirar per no esgotar-te."
      ],
      en: [
        "It's exciting to feel this drive to take on the world; let that strength propel you.",
        "It's okay to feel a bit rushed; it's simply the thrill of the moment in your body.",
        "Enjoy the creative spark you feel right now, but remember to breathe so you don't burn out."
      ],
      fr: [
        "C'est excitant de ressentir cette envie de conquérir le monde ; laissez cette force vous propulser.",
        "Ce n'est pas grave d'être surexcité ; c'est simplement l'émotion du moment qui s'exprime.",
        "Profitez de l'étincelle créative que vous ressentez, mais n'oubliez pas de respirer."
      ]
    }
  },
  calm: {
    color: '#D1F2EB',
    icon: 'wind',
    phrases: {
      es: [
        "No pasa nada por bajar el ritmo; la calma es un estado necesario para sanar.",
        "Permítete simplemente estar presente, sin prisas ni presiones externas.",
        "Este silencio es tu espacio seguro para recargar energías y volver a tu centro."
      ],
      ca: [
        "No passa res per baixar el ritme; la calma és un estat necessari per guarir.",
        "Permet-te simplement estar present, sense presses ni pressions externes.",
        "Aquest silenci és el teu espai seguretat per recarregar energies i tornar al teu centre."
      ],
      en: [
        "It's okay to slow down; calm is a necessary state for healing.",
        "Allow yourself to simply be present, without rush or external pressure.",
        "This silence is your safe space to recharge and return to your center."
      ],
      fr: [
        "Ce n'est pas grave de ralentir ; le calme est un état nécessaire à la guérison.",
        "Autorisez-vous à simplement être présent, sans hâte ni pressions extérieures.",
        "Ce silence est votre espace de sécurité pour recharger vos énergies et revenir à votre centre."
      ]
    }
  },
  proud: {
    color: '#E1BEE7',
    icon: 'award',
    phrases: {
      es: [
        "Está bien reconocer que lo has hecho genial; darte crédito fortalece tu autoestima.",
        "No es ego, es valorar honestamente tu esfuerzo y el camino que has recorrido.",
        "Siéntete orgulloso porque solo tú sabes cuánto te ha costado realmente llegar hasta aquí."
      ],
      ca: [
        "Està bé reconèixer que ho has fet genial; donar-te crèdit enforteix la teva autoestima.",
        "No és ego, és valorar honestament el teu esforç i el camí que has recorregut.",
        "Sente't orgullós perquè només tu saps quant t'ha costat realment arribar fins aquí."
      ],
      en: [
        "It's okay to acknowledge that you've done great; giving yourself credit strengthens self-esteem.",
        "It's not ego; it's honestly valuing your effort and the path you've traveled.",
        "Be proud of yourself because only you know how much it cost you to get here."
      ],
      fr: [
        "C'est bien de reconnaître que vous avez assuré ; vous accorder du crédit renforce l'estime de soi.",
        "Ce n'est pas de l'ego, c'est valoriser votre effort et le chemin parcouru.",
        "Soyez fier de vous car vous seul savez ce qu'il vous a fallu pour en arriver là."
      ]
    }
  },
  confident: {
    color: '#D4EFDF',
    icon: 'shield',
    phrases: {
      es: [
        "Confía plenamente en tu capacidad, ya has superado situaciones difíciles anteriormente.",
        "No pasa nada si asoman dudas, la confianza es la decisión de seguir adelante.",
        "Esa seguridad interna que sientes es el fruto de tu experiencia y tus aprendizajes."
      ],
      ca: [
        "Confia plenament en la teva capacitat, ja has superat situacions difícils anteriorment.",
        "No passa res si apareixen dubtes, la confiança és la decisió de seguir endavant.",
        "Aquesta seguretat interna que sents és el fruit de la teva experiència i els teus aprenentatges."
      ],
      en: [
        "Trust fully in your ability; you've overcome difficult situations before.",
        "It's okay if doubts pop up; confidence is the decision to move forward.",
        "That inner security you feel is the fruit of your experience and learnings."
      ],
      fr: [
        "Faites pleinement confiance à votre capacité ; vous avez déjà surmonté des épreuves.",
        "Ce n'est pas grave si des doutes surgissent, la confiance est la décision d'avancer.",
        "Cette assurance que vous ressentez est le fruit de votre expérience et de vos acquis."
      ]
    }
  },
  grateful: {
    color: '#A2D9CE',
    icon: 'heart',
    phrases: {
      es: [
        "Agradecer los pequeños detalles permite ver la abundancia donde otros ven carencia.",
        "No pasa nada por detenerse a valorar lo que ya tienes hoy en lugar de sufrir por lo que falta.",
        "La gratitud nos ayuda a entender que estamos en el lugar correcto, rodeados de bendiciones."
      ],
      ca: [
        "Agrair els petits detalls permet veure l'abundància on altres veuen carència.",
        "No passa res per aturar-se a valorar el que ja tens avui en lloc de patir pel que falta.",
        "La gratitud ens ajuda a entendre que estem al lloc correcte, rodejats de benediccions."
      ],
      en: [
        "Appreciating small details allows you to see abundance where others see lack.",
        "It's okay to stop and value what you have today instead of suffering over what's missing.",
        "Gratitude helps us understand that we are in the right place, surrounded by blessings."
      ],
      fr: [
        "Apprécier les petits détails permet de voir l'abondance là où d'autres voient le manque.",
        "Ce n'est pas grave de s'arrêter pour apprécier ce que l'on a plutôt que de souffrir du manque.",
        "La gratitude nous aide à comprendre que nous sommes au bon endroit, entourés de bénédictions."
      ]
    }
  },
  in_love: {
    color: '#F8BBD0',
    icon: 'heart',
    phrases: {
      es: [
        "Es un sentimiento hermoso, disfrútalo al máximo y sin miedos al futuro.",
        "Estar vulnerable es una parte esencial y valiente de querer a alguien con todo el corazón.",
        "No pasa nada por dejarte llevar y permitir que el cariño guíe tus pasos."
      ],
      ca: [
        "És un sentiment bell, gaudeix-lo al màxim i sense pors al futur.",
        "Estar vulnerable és una part essencial i valenta d'estimar algú amb tot el cor.",
        "No passa res per deixar-te portar i permetre que l'afecte guiï els teus passos."
      ],
      en: [
        "It's a beautiful feeling; enjoy it to the fullest without fears of the future.",
        "Being vulnerable is an essential and brave part of loving someone with all your heart.",
        "It's okay to let yourself go and allow affection to guide your steps."
      ],
      fr: [
        "C'est un sentiment magnifique, profitez-en au maximum sans crainte de l'avenir.",
        "Être vulnérable est une partie essentielle et courageuse du fait d'aimer de tout son cœur.",
        "Ce n'est pas grave de se laisser porter et de laisser l'affection guider ses pas."
      ]
    }
  },
  peaceful: {
    color: '#E8F8F5',
    icon: 'feather',
    phrases: {
      es: [
        "No pasa nada por detener el mundo un momento, cerrar los ojos y simplemente respirar.",
        "Estar en paz contigo mismo es el mejor regalo que te puedes dar hoy.",
        "Disfruta de este equilibrio, te ayuda a ver todo con una mirada mucho más limpia."
      ],
      ca: [
        "No passa res per aturar el món un moment, tancar els ulls i simplement respirar.",
        "Estar en pau amb tu mateix és el millor regal que et pots fer avui.",
        "Gaudeix d'aquest equilibri, t'ajuda a veure-ho tot amb una mirada molt més neta."
      ],
      en: [
        "It's okay to stop the world for a moment, close your eyes, and simply breathe.",
        "Being at peace with yourself is the best gift you can give yourself today.",
        "Enjoy this balance; it helps you see everything with a much clearer perspective."
      ],
      fr: [
        "Ce n'est pas grave d'arrêter le monde un instant, de fermer les yeux et de respirer.",
        "Être en paix avec soi-même est le plus beau cadeau que vous puissiez vous faire aujourd'hui.",
        "Profitez de cet équilibre, il vous aide à voir tout avec un regard plus pur."
      ]
    }
  },
  sad: {
    color: '#D6EAF8',
    icon: require('../../assets/images/sad.svg'),
    phrases: {
      es: [
        "No pasa nada por estar triste; a veces el alma necesita lluvia para entender qué pasa.",
        "Permítete sentir la tristeza sin juzgarte; es la brújula que te dice qué necesitas cambiar.",
        "Estar triste no es un error, es una pausa necesaria para procesar y volver a empezar."
      ],
      ca: [
        "No passa res per estar trist; a vegades l'ànima necessita pluja per entendre què passa.",
        "Permet-te sentir la tristesa sense jutjar-te; és la brúixola que et diu què has de canviar.",
        "Estar trist no és un error, és una pausa necessària per processar i tornar a començar."
      ],
      en: [
        "It's okay to be sad; sometimes the soul needs rain to understand what's happening.",
        "Allow yourself to feel sadness without judgment; it's the compass telling you what to change.",
        "Being sad is not a mistake; it's a necessary pause to process and start over."
      ],
      fr: [
        "Ce n'est pas grave d'être triste ; parfois, l'âme a besoin de pluie pour comprendre.",
        "Autorisez-vous à être triste sans vous juger ; c'est la boussole de vos besoins.",
        "Être triste n'est pas une erreur, c'est une pause nécessaire pour repartir."
      ]
    }
  },
  angry: {
    color: '#FADBD8',
    icon: require('../../assets/images/angry.svg'),
    phrases: {
      es: [
        "Es normal estar enfadado cuando sientes injusticia; no te juzgues por tus sentimientos.",
        "No pasa nada por sentir rabia; intenta respirar antes de actuar para no herir a otros.",
        "Tu enfado te envía un mensaje claro: algo en tu vida necesita un cambio constructivo."
      ],
      ca: [
        "És normal estar enfadat quan sents injustícia; no et jutgis pels teus sentiments.",
        "No passa res per sentir ràbia; intenta respirar abans d'actuar per no ferir els altres.",
        "El teu enfadament t'envia un missatge clar: alguna cosa a la teva vida necessita un canvi."
      ],
      en: [
        "It's normal to be angry when you feel injustice; don't judge yourself for your feelings.",
        "It's okay to feel rage; try to breathe before acting so you don't hurt others.",
        "Your anger sends a clear message: something in your life needs a constructive change."
      ],
      fr: [
        "Il est normal d'être en colère face à l'injustice ; ne vous jugez pas pour vos sentiments.",
        "Ce n'est pas grave de ressentir de la rage ; respirez avant d'agir pour ne pas blesser.",
        "Votre colère envoie un message clair : quelque chose doit changer de façon constructive."
      ]
    }
  },
  scared: {
    color: '#EBEDEF',
    icon: 'eye-off',
    phrases: {
      es: [
        "Tener miedo es humano y natural ante la incertidumbre; no significa que seas débil.",
        "No pasa nada por sentirte inseguro; la valentía es caminar de la mano con el miedo.",
        "Escucha lo que tu miedo intenta decirte, pero no permitas que él tome tus decisiones."
      ],
      ca: [
        "Tenir por és humà i natural davant la incertesa; no significa que siguis feble.",
        "No passa res per sentir-te insegur; la valentia és caminar de la mà amb la por.",
        "Escolta el que la teva por intenta dir-te, però no permetis que sigui ella qui decideixi."
      ],
      en: [
        "Being afraid is human and natural in uncertainty; it doesn't mean you are weak.",
        "It's okay to feel insecure; bravery is walking hand-in-hand with fear.",
        "Listen to what your fear is trying to tell you, but don't let it make your decisions."
      ],
      fr: [
        "Avoir peur est humain et naturel face à l'incertitude ; cela ne signifie pas être faible.",
        "Ce n'est pas grave d'être inquiet ; le courage, c'est d'avancer malgré la peur.",
        "Écoutez ce que votre peur vous dit, mais ne la laissez pas décider pour vous."
      ]
    }
  },
  anxious: {
    color: '#E8DAEF',
    icon: 'activity',
    phrases: {
      es: [
        "No pasa nada por sentir que todo va rápido; cierra los ojos y respira muy hondo.",
        "Tu ansiedad intenta protegerte, pero recuerda que aquí y ahora estás a salvo.",
        "No tienes que resolver el futuro hoy; céntrate solo en el siguiente paso pequeño."
      ],
      ca: [
        "No passa res per sentir que tot va ràpid; tanca els ulls i respira molt fons.",
        "La teva ansietat intenta protegir-te, però recorda que aquí i ara estàs fora de perill.",
        "No has de resoldre el futur avui; centra't només en el següent pas petit."
      ],
      en: [
        "It's okay to feel like everything is moving fast; close your eyes and breathe deeply.",
        "Your anxiety is trying to protect you, but remember that here and now you are safe.",
        "You don't have to solve the future today; focus only on the next small step."
      ],
      fr: [
        "Ce n'est pas grave de sentir que tout va trop vite ; fermez les yeux et respirez.",
        "Votre anxiété essaie de vous protéger, mais rappelez-vous qu'ici vous êtes en sécurité.",
        "Vous n'avez pas à résoudre le futur aujourd'hui ; faites juste un petit pas après l'autre."
      ]
    }
  },
  annoyed: {
    color: '#FEF5E7',
    icon: 'slash',
    phrases: {
      es: [
        "No pasa nada por estar molesto; a veces las pequeñas cosas se acumulan y agotan.",
        "Es normal que esto te fastidie; permítete sentir el descontento sin fingir que todo va bien.",
        "Tómate un respiro para que esta molestia pasajera no amargue el resto de tu día."
      ],
      ca: [
        "No passa res per estar molest; a vegades les petites coses s'acumulen i esgoten.",
        "És normal que això et fastiguegi; permet-te sentir el descontentament sense fingir.",
        "Pren-te un respir perquè aquesta molèstia passatgera no t'amargui la resta del dia."
      ],
      en: [
        "It's okay to be annoyed; sometimes small things pile up and wear you out.",
        "It's normal for this to bother you; feel the discontent without pretending everything is fine.",
        "Take a breather so this fleeting annoyance doesn't ruin the rest of your day."
      ],
      fr: [
        "Ce n'est pas grave d'être agacé ; parfois les petites choses s'accumulent et épuisent.",
        "C'est normal que cela vous dérange ; ressentez le mécontentement sans faire semblant.",
        "Faites une pause pour que cet agacement passager ne gâche pas votre journée."
      ]
    }
  },
  frustrated: {
    color: '#F5CBA7',
    icon: 'target',
    phrases: {
      es: [
        "No pasa nada si las cosas no han salido hoy; los contratiempos son parte del aprendizaje.",
        "La frustración indica que te importa lo que haces; úsala para replantear tu estrategia.",
        "Acepta que hoy no ha podido ser y recuerda que mañana tendrás una nueva oportunidad."
      ],
      ca: [
        "No passa res si les coses no han sortit avui; els contratemps són part de l'aprenentatge.",
        "La frustració indica que t'importa el que fas; usa-la per replantejar la teva estratègia.",
        "Accepta que avui no ha pogut ser i recorda que demà tindràs una nova oportunitat."
      ],
      en: [
        "It's okay if things didn't work out today; setbacks are part of learning.",
        "Frustration shows that you care; use it to rethink your strategy instead of judging yourself.",
        "Accept that today wasn't the day and remember you'll have a new chance tomorrow."
      ],
      fr: [
        "Ce n'est pas grave si les choses n'ont pas marché ; les échecs font partie de l'apprentissage.",
        "La frustration montre que vous tenez à ce que vous faites ; revoyez votre stratégie.",
        "Acceptez que ce n'était pas pour aujourd'hui ; demain sera une nouvelle chance."
      ]
    }
  },
  embarrassed: {
    color: '#FDEDEC',
    icon: require('../../assets/images/embarrassed.svg'),
    phrases: {
      es: [
        "No pasa nada por equivocarse en público; la perfección es un mito que nos aleja de la realidad.",
        "Esa sensación de incomodidad pasará pronto; no permitas que un momento defina quién eres.",
        "Reírse de uno mismo es el mejor antídoto para disolver la vergüenza y recuperar la calma."
      ],
      ca: [
        "No passa res per equivocar-se en públic; la perfecció és un mite que ens allunya de la realitat.",
        "Aquesta sensació d'incomoditat passarà aviat; no permetis que un moment defineixi qui ets.",
        "Riure's d'un mateix és el millor antídot per dissoldre la vergonya i recuperar la calma."
      ],
      en: [
        "It's okay to make a mistake in public; perfection is a myth that distances us from reality.",
        "That feeling of discomfort will pass soon; don't let a single moment define who you are.",
        "Laughing at yourself is the best antidote to dissolve shame and regain calm."
      ],
      fr: [
        "Ce n'est pas grave de se tromper ; la perfection est un mythe qui nous éloigne du réel.",
        "L'inconfort passera vite ; ne laissez pas un instant définir qui vous êtes.",
        "Rire de soi est le meilleur antidote pour dissiper la honte et retrouver son calme."
      ]
    }
  },
  lonely: {
    color: '#D5DBDB',
    icon: 'user-minus',
    phrases: {
      es: [
        "No pasa nada por sentirte solo; es una invitación a escucharte y conocerte mejor.",
        "A veces necesitamos estar con nosotros mismos para entender nuestras necesidades reales.",
        "Sentirse solo es universal; no significa que estés defectuoso ni que nadie te quiera."
      ],
      ca: [
        "No passa res per sentir-te sol; és una invitació a escoltar-te i conèixer-te millor.",
        "A vegades necessitem estar amb nosaltres mateixos per entendre les nostres necessitats reals.",
        "Sentir-se sol és universal; no significa que siguis defectuós ni que ningú t'estimi."
      ],
      en: [
        "It's okay to feel lonely; it's a deep invitation to listen and get to know yourself better.",
        "Sometimes we need to be with ourselves to understand our true needs without noise.",
        "Feeling lonely is universal; it doesn't mean you are flawed or unloved."
      ],
      fr: [
        "Ce n'est pas grave de se sentir seul ; c'est une invitation à mieux se connaître.",
        "Parfois, nous avons besoin d'être seuls pour comprendre nos vrais besoins.",
        "Se sentir seul est universel ; cela ne signifie pas que vous avez un problème."
      ]
    }
  },
  worried: {
    color: '#F2F4F4',
    icon: 'help-circle',
    phrases: {
      es: [
        "No pasa nada por estar preocupado; solo significa que te importa lo que sucede.",
        "Intenta soltar el peso de lo que no puedes controlar; preocuparse no soluciona el mañana.",
        "Respira; la mayoría de las cosas que tememos en nuestra mente nunca llegan a suceder."
      ],
      ca: [
        "No passa res per estar preocupat; només significa que t'importa el que succeeix.",
        "Intenta deixar anar el pes del que no pots controlar; preocupar-se no soluciona el demà.",
        "Respira; la majoria de les coses que temem en la nostra ment mai arriben a succeir."
      ],
      en: [
        "It's okay to be worried; it just means you care about what is happening.",
        "Try to let go of the weight of what you can't control; worrying doesn't solve tomorrow.",
        "Breathe; most of the things we fear in our minds never actually happen."
      ],
      fr: [
        "Ce n'est pas grave d'être inquiet ; cela signifie simplement que vous tenez aux choses.",
        "Lâchez le poids de ce que vous ne contrôlez pas ; l'inquiétude ne règle pas l'avenir.",
        "Respirez ; la plupart de nos peurs ne se réalisent jamais."
      ]
    }
  },
  furious: {
    color: '#F1948A',
    icon: 'alert-triangle',
    phrases: {
      es: [
        "No pasa nada por sentir esta explosión de rabia, pero date el espacio para no dañarte.",
        "La furia es como una tormenta: muy ruidosa, pero pasajera si dejas que siga su curso.",
        "Es normal sentir que vas a estallar; busca un lugar seguro donde soltar esa tensión."
      ],
      ca: [
        "No passa res per sentir aquesta explosió de ràbia, però dona't l'espai per no danyar-te.",
        "La fúria és com una tempesta: molt sorollosa, però passatgera si deixes que segueixi el seu curs.",
        "És normal sentir que esclataràs; busca un lloc segur on deixar anar aquesta tensió."
      ],
      en: [
        "It's okay to feel this explosion of rage, but give yourself space so it doesn't harm you.",
        "Fury is like a storm: very loud, but fleeting if you let it run its course.",
        "It's normal to feel like you're going to explode; find a safe place to release that tension."
      ],
      fr: [
        "Ce n'est pas grave de ressentir cette rage, mais donnez-vous de l'espace pour ne pas souffrir.",
        "La fureur est comme un orage : bruyante, mais passagère si on la laisse passer.",
        "Il est normal de vouloir exploser ; trouvez un endroit sûr pour évacuer cette tension."
      ]
    }
  },
  tired: {
    color: '#AED6F1',
    icon: 'battery',
    phrases: {
      es: [
        "No pasa nada por estar agotado; has hecho un gran esfuerzo y tu cuerpo necesita recuperarse.",
        "Descansar no es perder el tiempo, es una inversión necesaria para tu salud futura.",
        "Escucha a tu cuerpo hoy; si te pide una pausa prolongada, dásela sin dudarlo."
      ],
      ca: [
        "No passa res per estar esgotat; has fet un gran esforç i el teu cos necessita recuperar-se.",
        "Descansar no és perdre el temps, és una inversió necessària per a la teva salut futura.",
        "Escolta el teu cos avui; si et demana una pausa prolongada, dona-li sense dubtar-ho."
      ],
      en: [
        "It's okay to be exhausted; you've put in a lot of effort and your body needs to recover.",
        "Resting is not a waste of time; it's a necessary investment in your future health.",
        "Listen to your body today; if it asks for a long break, give it without hesitation."
      ],
      fr: [
        "Ce n'est pas grave d'être épuisé ; vous avez fait des efforts et votre corps doit récupérer.",
        "Se reposer n'est pas perdre son temps, c'est investir dans sa santé future.",
        "Écoutez votre corps ; s'il demande une pause prolongée, accordez-la-lui."
      ]
    }
  },
  sleepy: {
    color: '#d0bddfc4',
    icon: require('../../assets/images/sleepy.svg'),
    phrases: {
      es: [
        "No pasa nada por querer desconectar y dormir; el sueño es el gran restaurador del espíritu.",
        "Tu mente necesita apagarse un rato para procesar lo vivido y brillar más mañana.",
        "Ríndete al descanso sin remordimientos; el mundo seguirá girando mientras recuperas fuerzas."
      ],
      ca: [
        "No passa res per voler desconnectar i dormir; el son és el gran restaurador de l'esperit.",
        "La teva ment necessita apagar-se una estona per processar el que has viscut i brillar més demà.",
        "Rendeix-te al descans sense remordiments; el món seguirà girant mentre recuperes forces."
      ],
      en: [
        "It's okay to want to disconnect and sleep; sleep is the great restorer of the spirit.",
        "Your mind needs to turn off for a while to process and shine brighter tomorrow.",
        "Surrender to rest without regrets; the world will keep turning while you recover."
      ],
      fr: [
        "Ce n'est pas grave de vouloir dormir ; le sommeil est le restaurateur de l'esprit.",
        "Votre esprit doit s'éteindre pour traiter le vécu et mieux briller demain.",
        "Reposez-vous sans remords ; le monde tournera sans vous pendant que vous récupérez."
      ]
    }
  },
  bored: {
    color: '#F4F6F7',
    icon: 'coffee',
    phrases: {
      es: [
        "No pasa nada por no tener nada que hacer; en estos vacíos nace la creatividad.",
        "El aburrimiento es el descanso necesario para una mente que suele estar sobreestimulada.",
        "No te sientas culpable por este tiempo 'muerto'; disfrútalo como un respiro necesario."
      ],
      ca: [
        "No passa res per no tenir res a fer; en aquests buits neix la creativitat.",
        "L'avorriment és el descans necessari per a una ment que sol estar sobreestimulada.",
        "No et sentis culpable per aquest temps 'mort'; gaudeix-ne com un respir necessari."
      ],
      en: [
        "It's okay to have nothing to do; it's in these gaps that creativity is born.",
        "Boredom is the necessary rest for a mind that is usually overstimulated.",
        "Don't feel guilty about this 'down time'; enjoy it as a necessary breather."
      ],
      fr: [
        "Ce n'est pas grave de n'avoir rien à faire ; la créativité naît de ces vides.",
        "L'ennui est le repos nécessaire pour un esprit d'habitude surstimulé.",
        "Ne culpabilisez pas pour ce temps mort ; voyez-le comme une respiration."
      ]
    }
  },
  confused: {
    color: '#e0e7c2',
    icon: require('../../assets/images/confused.svg'),
    phrases: {
      es: [
        "No pasa nada por no tener todas las respuestas; la duda es el motor del crecimiento.",
        "Estar confundido es el paso previo necesario antes de entender algo nuevo y más complejo.",
        "No te fuerces a decidir hoy; la claridad llegará cuando tu mente haya procesado todo."
      ],
      ca: [
        "No passa res per no tenir totes les respostes; el dubte és el motor del creixement.",
        "Estar confós és el pas previ necessari abans d'entendre alguna cosa nova i més complexa.",
        "No et fiquis pressió per decidir avui; la claredat arribarà quan la ment hagi processat tot."
      ],
      en: [
        "It's okay to not have all the answers; doubt is the engine of growth.",
        "Being confused is the necessary preceding step before understanding something new.",
        "Don't force a decision today; clarity will come once your mind has processed it all."
      ],
      fr: [
        "Ce n'est pas grave de ne pas avoir de réponses ; le doute est le moteur de la croissance.",
        "Être confus est l'étape nécessaire avant de comprendre quelque chose de nouveau.",
        "Ne décidez rien aujourd'hui ; la clarté viendra quand tout sera assimilé."
      ]
    }
  },
  surprised: {
    color: '#FCF3CF',
    icon: 'gift',
    phrases: {
      es: [
        "No pasa nada por quedarte en shock; lo inesperado genera un impacto fuerte en la psique.",
        "Acepta la sorpresa y permite que tus emociones se asienten antes de intentar reaccionar.",
        "Es normal que te cueste procesar lo inesperado; el asombro nos mantiene vivos."
      ],
      ca: [
        "No passa res per quedar-te en xoc; l'inesperat genera un impacte fort en la psique.",
        "Accepta la sorpresa i permet que les teves emocions s'assentin abans d'intentar reaccionar.",
        "És normal que et costi processar l'inesperat; l'astorament ens manté vius."
      ],
      en: [
        "It's okay to be in shock; the unexpected has a strong impact on the psyche.",
        "Accept the surprise and allow your emotions to settle before trying to react.",
        "It's normal to find it hard to process the unexpected; wonder keeps us alive."
      ],
      fr: [
        "Ce n'est pas grave d'être sous le choc ; l'imprévu a un fort impact psychologique.",
        "Acceptez la surprise et laissez vos émotions se poser avant de réagir.",
        "Il est normal de peiner à assimiler l'inattendu ; l'étonnement nous garde vivants."
      ]
    }
  },
  serious: {
    color: '#D5D8DC',
    icon: 'user-check',
    phrases: {
      es: [
        "No pasa nada por estar serio hoy; hay momentos que requieren toda nuestra atención.",
        "Estar enfocado no significa estar enfadado; simplemente estás presente en la tarea.",
        "Respeta tu necesidad de sobriedad hoy si eso te ayuda a actuar con coherencia."
      ],
      ca: [
        "No passa res per estar seriós avui; hi ha moments que requereixen tota l'atenció.",
        "Estar enfocat no significa estar enfadat; simplement estàs present en la tasca.",
        "Respecta la teva necessitat de sobrietat avui si això t'ajuda a actuar amb coherència."
      ],
      en: [
        "It's okay to be serious today; there are moments that require all our attention.",
        "Being focused doesn't mean being angry; you are simply present in the task.",
        "Respect your need for sobriety today if it helps you act with consistency."
      ],
      fr: [
        "Ce n'est pas grave d'être sérieux ; certains moments exigent toute notre attention.",
        "Être concentré n'est pas être en colère ; vous êtes simplement dédié à votre tâche.",
        "Respectez votre besoin de sérieux s'il vous aide à agir avec cohérence."
      ]
    }
  },
  shy: {
    color: '#FBEEE6',
    icon: 'user',
    phrases: {
      es: [
        "No pasa nada por no querer ser el centro de atención; cada uno tiene su propio ritmo.",
        "Tu timidez es una forma de cuidar tu espacio personal y tus emociones internas.",
        "Es perfectamente válido observar con atención antes de decidir participar de forma activa."
      ],
      ca: [
        "No passa res per no voler ser el centre d'atenció; cadascú té el seu propi ritme.",
        "La teva timidesa és una forma de cuidar el teu espai personal i les emocions internes.",
        "És perfectament vàlid observar amb atenció abans de decidir participar de forma activa."
      ],
      en: [
        "It's okay to not want to be the center of attention; everyone has their own pace.",
        "Your shyness is a way of taking care of your personal space and inner emotions.",
        "It is perfectly valid to observe carefully before deciding to participate actively."
      ],
      fr: [
        "Ce n'est pas grave de ne pas vouloir être au centre ; chacun a son propre rythme.",
        "Votre timidité est une façon de protéger votre espace et vos émotions.",
        "Il est tout à fait valable d'observer avant de décider de participer activement."
      ]
    }
  },
  hungry: {
    color: '#FAD7A0',
    icon: 'shopping-cart',
    phrases: {
      es: [
        "No pasa nada por tener mucha hambre; tu cuerpo te pide la energía que necesita.",
        "Escuchar esta señal biológica es cuidarte de verdad; no la ignores ni la postergues.",
        "Para un momento y busca algo nutritivo; tu bienestar depende de cómo alimentas tu templo."
      ],
      ca: [
        "No passa res per tenir molta gana; el teu cos et demana l'energia que necessita.",
        "Escoltar aquest senyal biològic és cuidar-te de debò; no l'ignoris ni la posterguis.",
        "Atura't un moment i busca quelcom nutritiu; el teu benestar depèn de com t'alimentes."
      ],
      en: [
        "It's okay to be very hungry; your body is asking for the energy it needs.",
        "Listening to this biological signal is true self-care; don't ignore or postpone it.",
        "Stop for a moment and find something nutritious; your well-being depends on it."
      ],
      fr: [
        "Ce n'est pas grave d'avoir faim ; votre corps réclame l'énergie dont il a besoin.",
        "Écouter ce signal biologique, c'est prendre soin de soi ; ne l'ignorez pas.",
        "Arrêtez-vous et mangez sainement ; votre bien-être en dépend directement."
      ]
    }
  }
};
export const getRandomMoodPhrase = (mood) => {
  const config = MOOD_CONFIG[mood];
  if (!config) return "Gracias por registrar cómo te sientes.";
  return config.phrases[Math.floor(Math.random() * config.phrases.length)];
};


export const avatarMap = {
  'avatar1': require('../../assets/images/avatar/avatar1.png'),
  'avatar2': require('../../assets/images/avatar/avatar2.png'),
  'avatar3': require('../../assets/images/avatar/avatar3.png'),
  'avatar4': require('../../assets/images/avatar/avatar4.png'),
  'avatar5': require('../../assets/images/avatar/avatar5.png'),
  'avatar6': require('../../assets/images/avatar/avatar6.png'),
  'avatar7': require('../../assets/images/avatar/avatar7.png'),
  'avatar8': require('../../assets/images/avatar/avatar8.png'),
  'avatar9': require('../../assets/images/avatar/avatar9.png'),
  'avatar10': require('../../assets/images/avatar/avatar10.png'),
  'avatar11': require('../../assets/images/avatar/avatar11.png'),
  'avatar12': require('../../assets/images/avatar/avatar12.png'),
  'avatar13': require('../../assets/images/avatar/avatar13.png'),
  'avatar14': require('../../assets/images/avatar/avatar14.png'),
  'avatar15': require('../../assets/images/avatar/avatar15.png'),
  'avatar16': require('../../assets/images/avatar/avatar16.png'),
  'avatar17': require('../../assets/images/avatar/avatar17.png'),
  'avatar18': require('../../assets/images/avatar/avatar18.png'),
  'avatar19': require('../../assets/images/avatar/avatar19.png'),
  'avatar20': require('../../assets/images/avatar/avatar20.png'),
  'avatar21': require('../../assets/images/avatar/avatar21.png'),
  'avatar22': require('../../assets/images/avatar/avatar22.png'),
  'avatar23': require('../../assets/images/avatar/avatar23.png'),
  'avatar24': require('../../assets/images/avatar/avatar24.png'),
  'avatar25': require('../../assets/images/avatar/avatar25.png'),
  'avatar26': require('../../assets/images/avatar/avatar26.png'),
};
export const getRandomQuestions = (data, count = 10) => {
  const actualData = Array.isArray(data) 
    ? data 
    : (data?.encuesta_estres_completa || []);

  if (actualData.length === 0) {
    console.error("getRandomQuestions: No se encontraron preguntas.");
    return [];
  }

  const shuffled = [...actualData].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
};

export const getJsonText = (textObject, lang) => {
  if (!textObject) return "";
  const shortLang = lang ? lang.split('-')[0] : 'es';
  return textObject[shortLang] || textObject['es'] || "";
};

export const processResults = (answers) => {
  const breakdown = { relajado: 0, leve: 0, moderado: 0, alto: 0 };
  let total_score = 0;
  
  const points = { 
    relajado: 0, 
    leve: 1, 
    moderado: 2, 
    alto: 3 
  };

  answers.forEach(ans => {
    const nivel = ans.nivel;
    if (breakdown.hasOwnProperty(nivel)) {
      breakdown[nivel]++;
      total_score += points[nivel];
    }
  });

  return { breakdown, total_score };
};


export const getRandomQuote = () => {
  const currentLang = i18n.language?.split('-')[0] || 'en';
  const phrases = quotesData[currentLang] || quotesData['en'];
  const randomIndex = Math.floor(Math.random() * phrases.length);
  return phrases[randomIndex];
};