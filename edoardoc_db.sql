-- phpMyAdmin SQL Dump
-- version 4.0.10.6
-- http://www.phpmyadmin.net
--
-- Host: localhost
-- Generato il: Dic 30, 2014 alle 17:35
-- Versione del server: 5.5.40-cll
-- Versione PHP: 5.4.23

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;

--
-- Database: `edoardoc_db`
--

-- --------------------------------------------------------

--
-- Struttura della tabella `ec_album`
--

CREATE TABLE IF NOT EXISTS `ec_album` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `title` varchar(255) NOT NULL,
  `data` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=2 ;

--
-- Dump dei dati per la tabella `ec_album`
--

INSERT INTO `ec_album` (`id`, `title`, `data`) VALUES
(1, 'senza lavoro', '2012-10-11 23:52:31');

-- --------------------------------------------------------

--
-- Struttura della tabella `ec_blog`
--

CREATE TABLE IF NOT EXISTS `ec_blog` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `date` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `title` varchar(255) NOT NULL,
  `content` longtext NOT NULL,
  `url` varchar(255) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=6 ;

--
-- Dump dei dati per la tabella `ec_blog`
--

INSERT INTO `ec_blog` (`id`, `date`, `title`, `content`, `url`) VALUES
(1, '2012-08-14 23:23:32', 'Paypal IPN - HOW TO', '<p><b>PER INIZIARE</b></p>\r\nPaypal IPN &egrave; un meccanismo di notifica che permette la ricezione immediata della conferma di avvenuto (o non avvenuto) pagamento direttamente sul proprio portale. In questo modo &egrave; possibile avviare successive operazioni come ad esempio l''attivazione di un servizio, l''aggiornamento di un database etc. etc... In questa sintetica guida esporr&ograve; in modo semplificato e funzionante l''utilizzo di questa chicca informatica.\r\n\r\n<p><b>CREARE UN TEST ACCOUNT</b></p>\r\n\r\nIl primo passo da fare &egrave; creare un account test, un account che permette false transazioni allo scopo di testare il funzionamento del servizio. Paypal chiama questo ambiente di test "sandbox". Il relativo account reale sar&agrave; praticamente identico, con l''unica differenza che le transazioni avverranno davvero.\r\nPotete creare l''account sandbox da questo link <a href="http://www.sandbox.paypal.com" target="_blank">http://www.sandbox.paypal.com</a>.\r\nUna volta creato il vostro profilo sandbox effettuate il login e cliccate prima su "test accounts" quindi su "create test account -> preconfigured".\r\nSpuntate la casella accanto a SELLER sotto la voce ACCOUNT TYPE. Compilate quindi il modulo memorizzando i dati che importate. La mail che vi sta chiedendo di inserire &egrave; una mail fittizia, funzioner&agrave; solo come identificativo dell''account che state creando. Una volta creato il profilo del venditore adesso sotto la voce test accounts troverete la tabella con la prima identit&agrave;. Quella strana mail che funge da nome account &egrave; di grande importanza, vedremo in seguito perch&ecute;. A questo punto create ancora un altro account preconfigured,compilate lo stesso modulo spuntando BUYER e aggiungete sufficiente denaro nel campo ________________\r\nAdesso dovreste trovare nella tabella dei test-accounts entrambi i profili generati. Uno &egrave; il venditore, l''altro il compratore.\r\n\r\n<p><b>PASSIAMO AL VOSTRO PORTALE</b></p>\r\nPer dirla in poche parole tutto il lavoro all''interno del vostro portale sta in un semplice form HTML e in una pagina PHP da poche righe. Il form invia una richiesta post alla pagina sandbox.paypal.com (per l''account test - paypal.com per l''account reale) con i relativi campi valorizzati. I "name" di questi input sono standard e non possono essere inventati, i value dipendono da noi. Potete trovare una lista dei campi paypal in questa pagina <a href="https://cms.paypal.com/it/cgi-bin/?cmd=_render-content&content_ID=developer/e_howto_html_Appx_websitestandard_htmlvariables" target="_blank">lista campi paypal</a>\r\n<br>\r\n<div style="background-color:#EEEEEE; margin-top:10px; margin-bottom:10px; text-align:left; padding:3px; font-size:12px;"><code>\r\n&lt;form method="post" action="http://www.sandbox.paypal.com/cgi-bin/webscr"&gt;<br>\r\n&lt;input type="hidden" name="cmd" value="_xclick"&gt;<br>\r\n&lt;input type="hidden" name="business" value="mail@accountvenditore"&gt;<br>\r\n&lt;input type="hidden" name="amount" value="100"&gt;<br>\r\n&lt;input type="hidden" name="quantity" value="1"&gt;<br>\r\n&lt;input type="hidden" name="currency_code" value="EUR"&gt;<br>\r\n&lt;input type="hidden" name="item_name" value="Donazione"&gt;<br>\r\n&lt;input type="hidden" name="custom" value="&lt;?php print $persona[''id'']; ?&gt;"&gt;<br>\r\n&lt;input hidden name="notify_url" value="http://www.miosito.it/ipn.php"&gt;<br>\r\n<br>&lt;input type="submit" name="paga" value="paga adesso"&gt;<br>\r\n&lt;/form&gt;\r\n</code></div>\r\nQuesto form si serve di campi etichettati dal servizio paypal. Intuitivamente capirete la maggior parte dei pezzi di questo form ma l''input cmd o l''input custom o l''input business e notify url necessitano di qualche descrizione.<br><br>\r\n<b>1.cmd</b> = <br>\r\n<b>2.business</b> = la mail/nome dell''account venditore generato da paypal (vd. sopra)<br>\r\n<b>3.custom</b> = variabile a scelta, pu&ograve; essere l''id di un cliente, la sua email, una stringa... potrebbe tornarvi utile.<br>\r\n<b>4.notify_url</b> = notify_url indica a paypal quale file nel vostro server &egrave; incaricato del check del pagamento. -> ipn <br><br>\r\nPaypal mette a disposizione una lista lunghissima di campi, compresi i dati dell''acquirente, o informazioni riguardanti la transazione.\r\nCliccando sul bottone submit verrete indirizzati alla pagina di pagamento relativa al campo business. Inseriamo i dati dell''account compratore che abbiamo creato e procediamo al pagamento. Dopo aver premuto paga adesso, sappiate che in background paypal sta gi&agrave; inviando i dati al vostro ascoltatore ipn... \r\n<p><b>L''IPN.php</b></p>\r\nScrivere l''ascoltatore &egrave; un operazione semplice. In sintesi esso funziona in questo modo: riceve una matassa di dati post da paypal, scorre uno per uno queste variabili post e le concatena in un messaggio. Quindi invia il messaggio e riceve la risposta. - FINE.\r\n\r\n<p><b>il codice</b></p>\r\nIniziamo la creazione del messaggio.\r\n<div style="background-color:#EEEEEE; margin-top:10px; margin-bottom:10px; text-align:left; padding:3px; font-size:12px;"><code>\r\n$req = ''cmd=_notify-validate'';\r\n</code></div>\r\nQuindi concateniamo tutte le variabili _POST inviate da paypal alla nostra pagina ipn.php\r\n<div style="background-color:#EEEEEE; margin-top:10px; margin-bottom:10px; text-align:left; padding:3px; font-size:12px;"><code>\r\nforeach($_POST as $key => $value) { <br> \r\n&nbsp;&nbsp;&nbsp;&nbsp;$value = urlencode(stripslashes($value)); <br> \r\n&nbsp;&nbsp;&nbsp;&nbsp;$req .= ''&''.$key.''=''.$value; <br>\r\n}\r\n</code></div>\r\nCreiamo un header per il nostro messaggio\r\n<div style="background-color:#EEEEEE; margin-top:10px; margin-bottom:10px; text-align:left; padding:3px; font-size:12px;"><code>\r\n$header = "POST /cgi-bin/webscr HTTP/1.0\\r\\n";<br>\r\n$header .= "Content-Type: application/x-www-form-urlencoded\\r\\n";<br>\r\n$header .= ''Content-Length:''.strlen($req).''\\r\\n\\r\\n'';<br>\r\n</code></div>\r\nApriamo il socket per il dialogo (per l''account reale togliamo sandbox. all''url)\r\n<div style="background-color:#EEEEEE; margin-top:10px; margin-bottom:10px; text-align:left; padding:3px; font-size:12px;"><code>\r\n$fp = fsockopen(''ssl://www.sandbox.paypal.com'', 443, $errno, $errstr, 30);\r\n</code></div>\r\nE iniziamo il ciclo di dialogo con il server di paypal...\r\n<div style="background-color:#EEEEEE; margin-top:10px; margin-bottom:10px; text-align:left; padding:3px; font-size:12px;"><code>\r\nif(!$fp)<br>\r\n&nbsp;&nbsp;exit();<br>\r\nelse {<br><br>\r\n&nbsp;&nbsp;&nbsp;&nbsp;fwrite($fp, $header)<br><br>\r\n&nbsp;&nbsp;&nbsp;&nbsp;fputs($fp, $header . $req); <br> <br>\r\n&nbsp;&nbsp;&nbsp;&nbsp;while(!feof($fp))<br>\r\n&nbsp;&nbsp;&nbsp;&nbsp;{<br>\r\n&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;$res = fgets($fp, 1024);<br>\r\n<br><br>\r\n\r\n&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;if(strcmp($res, "VERIFIED") == 0) { <br>  \r\n<br>\r\n&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<font color="green">//Transazione a buon fine -> aggiorna il database</font><br><br>\r\n&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;fclose ($fp);<br>\r\n&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;}<br>\r\n&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;else if(strcmp($res, "INVALID") == 0) {<br>\r\n&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;fclose($fp);<br> \r\n&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;}<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;}<br>\r\n}\r\n</code></div>\r\nE'' utile conoscere qualche variabile post inviata da paypal al nostro ipn, come ad esempio la "custom" di cui ho parlato in precedenza, o l''email dell''acquirente, o l''id della transazione. Vediamo almeno queste, altre variabili potrete trovare a questo link -> <a href="https://cms.paypal.com/it/cgi-bin/?cmd=_render-content&content_ID=developer/e_howto_html_IPNandPDTVariables" target="_blank">lista variabili IPN</a>\r\n<div style="background-color:#EEEEEE; margin-top:10px; margin-bottom:10px; text-align:left; padding:3px; font-size:12px;"><code>\r\n$buyerEmail = $_POST[''payer_email''];<br>\r\n$buyerDatoCustom = $_POST[''custom''];<br>\r\n$transId = $_POST[''txn_id''];\r\n</code></div>\r\nTutte queste sono variabili che naturalmente potrete utilizzare automaticamente all''interno del vostro ipn.php.\r\nVorrei ricordare che le operazioni sull''ipn avvengono in background, proprio nel momento in cui il cliente preme il pulsante "paga adesso" nella pagina paypal del vostro account business.<br>\r\n<p><b>note</b></p>\r\n*http://www.sandbox.paypal.com va sostituito con http://www.paypal.com per le transazioni reali.<br>\r\n*Al posto di mail@accountvenditore nel campo "business" va inserita la mail relativa all''account del venditore.<br>\r\n*Dovrebbero poter essere gestite anche le altre eccezioni come ''PENDING''', ''),
(4, '2013-02-02 11:34:41', 'Philip Roth - l''animale morente', 'Premetto che nel momento in cui scrivo questa breve riflessione sull''Animale morente di Philip Roth non sono ancora a conoscenza delle opere reputate "superiori" di questo autorevole scrittore. La narrazione basata fondamentalmente sull''esperienza interiore di un sessantenne, &egrave; narrata in prima persona e riflette con forza incisiva e passionale sulla sua condizione di uomo innamorato sempre pi&ugrave; cosciente del proprio limite: la morte. Saranno infatti proprio l''amore e il sesso a ridestare in lui il pensiero della morte, e la sua passione per una ragazza pi&ugrave; giovane lo spingono ulteriormente a pensare con pi&ugrave; intensit&agrave; al suo futuro tragico pi&ugrave; prossimo, su un inizio la cui fine &egrave; gi&aacute; nell''aria. Philip Roth instaura un legame violento fra la carne e la morte come in qualche eccelso dipinto di Schiele. Collega le vicende per mezzo di un grigio soliloquio che, tanto pi&ugrave; si fa innomorato, tanto pi&ugrave; si fa tragico e nero. Questo romanzo parla di una bella storia nel momento sbagliato, di un ultimo bagliore, di una cessione momentanea, di una passione che &egrave; sempre viva ma che prima o poi verr&agrave; controllata (forse). Il sessantenne in questione &egrave; un professore, un professore condannato a sua volta a un''ennesima lezione. Un''escalation di sesso e morte.\r\n<br><br>\r\n\r\n<iframe width="560" height="315" src="http://www.youtube.com/embed/z2qTmdKfSjY" frameborder="0" allowfullscreen></iframe>\r\n<br></br></br>\r\nAltre opere che ho letto e che consiglio:\r\n<ul>\r\n<li>.L''umiliazione</li>\r\n<li>.Everyman</li>\r\n<li>.Il seno</li>\r\n<li>.Inganno</li>\r\n</ul>', ''),
(5, '2013-02-03 13:56:50', 'John MacCormic - 9 algoritmi che hanno cambiato il futuro', '<div style="float:left;">Editore in Italia: apogeo, 2012</div>\r\n</br></br>\r\nIl testo espone in modo semplice e comprensibile a tutti i meccanismi di funzionamento di alcuni fra i pi&ugrave; importanti algoritmi informatici della storia. MacCormick si serve di esempi a loro volta esemplari, adatti, e svolge un processo di slegamento mediante una trasposizione chiara e graduale dei concetti fondamentali. Inutile dire che per chi fosse interessato la curiosit&agrave; &egrave; continuamente stimolata, come se stessimo leggendo le dichiarizioni di un mago dopo una memorabile performance. Volete sapere a cosa servono le vernici colorate per spiegare la crittografia a chiave pubblica (https://)? Oppure siete interessati al modo in cui Google esegue le sue ricerche? E i files .zip? I programmi corregono i propri errori? I capitoli trattano la storia e il meccanismo di ogni algoritmo, cose che usiamo indifferentemente ogni giorno. \r\n\r\nVi sar&agrave; difficile staccare gli occhi dall''inchiostro. Consigliato. ', '');

-- --------------------------------------------------------

--
-- Struttura della tabella `ec_config`
--

CREATE TABLE IF NOT EXISTS `ec_config` (
  `chiave` varchar(255) NOT NULL,
  `valore` int(11) NOT NULL,
  `stringa` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dump dei dati per la tabella `ec_config`
--

INSERT INTO `ec_config` (`chiave`, `valore`, `stringa`) VALUES
('_CART_', 0, '');

-- --------------------------------------------------------

--
-- Struttura della tabella `ec_news`
--

CREATE TABLE IF NOT EXISTS `ec_news` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `date` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `title` varchar(255) NOT NULL,
  `content` text NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1 AUTO_INCREMENT=1 ;

-- --------------------------------------------------------

--
-- Struttura della tabella `ec_phalbums`
--

CREATE TABLE IF NOT EXISTS `ec_phalbums` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `title` varchar(255) NOT NULL,
  `notes` text NOT NULL,
  `type` int(11) NOT NULL,
  `date` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `sell` int(11) NOT NULL,
  `order` int(11) NOT NULL,
  `likes` int(11) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=9 ;

--
-- Dump dei dati per la tabella `ec_phalbums`
--

INSERT INTO `ec_phalbums` (`id`, `title`, `notes`, `type`, `date`, `sell`, `order`, `likes`) VALUES
(1, 'Girls', '', 1, '2013-05-21 17:45:11', 1, 1, 26),
(2, 'Holiday Beach 1', '', 1, '2013-03-09 18:53:38', 0, 5, 0),
(3, 'Holiday beach 2', '', 1, '2013-03-09 18:53:44', 0, 4, 0),
(4, 'Conceptual', '', 1, '2013-05-21 17:32:53', 1, 2, 36),
(6, 'Interior at night', '', 1, '2013-05-31 17:32:06', 0, 0, 5),
(7, 'GDC project', 'The <span style="font-style:italic;">GDC</span> project  is related to the field of <span style="font-style:italic;">software art</span>. It consists of a standard calculator capable of generating thoughts and poetry through the calculation process. This work can be seen as a meditation on the process of creating hyper individuality through information technology and collective intelligence. The project currently uses technologies php, javascript and html.\r\nYou can <b>contribute</b> to the amplification of the project by placing your own thoughts via the button "contribute with your experience".', 2, '2013-05-21 16:31:05', 0, 0, 4),
(8, 'The black square', '', 2, '2013-03-09 19:18:28', 0, 0, 0);

-- --------------------------------------------------------

--
-- Struttura della tabella `ec_portfolio`
--

CREATE TABLE IF NOT EXISTS `ec_portfolio` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `date` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `title` varchar(255) NOT NULL,
  `content` text NOT NULL,
  `url` varchar(255) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=6 ;

--
-- Dump dei dati per la tabella `ec_portfolio`
--

INSERT INTO `ec_portfolio` (`id`, `date`, `title`, `content`, `url`) VALUES
(1, '2012-08-14 15:25:01', 'Rete lavoro solidale', '<p>Sito dinamico: php, mySQL, jquery, smarty, css, html, Paypal IPN</p>\r\n<br>\r\nRete lavoro solidale &egrave; una struttura libera da ogni ingerenza sociopolitica, formatasi da un''idea di persone che come tanti stanno vivendo o hanno vissuto tutta la drammaticit&agrave; della crisi economica che sta attanagliando il nostro paese. Radicata sul tutto il territorio nazionale, la stessa opera esclusivamente on-line, in ogni capoluogo di provincia, predisposta a formare una rete d''interconnessione nazionale con lo scopo di far incontrare tutti quei soggetti, pubblici e privati, richiedenti e offerenti prestazioni lavorative le cui caratteristiche corrispondono al nostro imprinting definito solidale e di aiuto socio lavorativo. Il nostro operato, esclusivamente senza scopo di lucro imprenditoriale, trae il sostentamento necessario per la propria Sopravvivenza operativa, solo con i contributi liberi e volontari degli iscritti che beneficiano dei nostri servizi e di tutte quelle persone che dedicano parte del loro tempo in forma di volontariato nella gestione tecnica e amministrativa della struttura.', 'http://www.retelavorosolidale.it'),
(2, '2010-08-14 16:23:42', 'Christian''s image', '<p>Sito dinamico: php, mySQL, css, html</p>\r\n<br>\r\nLo studio fotografico Christian''s Image mette al servizio del cliente servizi fotografici di qualit&agrave; che uniscono da anni alla tecnica fotografica la passione per lo scatto. E'' da questa costante combinazione tra arte, innovazione e passione che nasce lo spirito dello studio Christian''s Image, capace di combinarsi in una sinergia di sperimentazioni al passo coi tempi e che, adesso, incontra le nuove estensioni denotate dall''informatica e dal nuovo corollario della condivisione multimediale. \r\n\r\nLo studio realizza book fotografici cartacei e virtuali, spazi personali digitali e video-montaggi matrimoniali capaci di raccontare la coppia con semplicit&agrave;, attenzione e fantasia senza rinunciare alla naturalit&agrave; dell''esposizione. Si realizzano inoltre stampe di tutti i tipi comprese quelle su tessuti di vario genere e di diversa complessit&agrave;, progettazione e sviluppo di siti web dinamici strutturati secondo i pi&ugrave; moderni standard di comunicazione, fotomontaggi ed elaborazioni grafiche a richiesta della nostra clientela. ', 'http://www.christianfuso.it/'),
(4, '2012-08-19 23:03:45', 'FormToDb.class.php', 'It allows quick entry and optionally controlled all or some data from a form into a mySQL database using a few lines.\r\nThrough its properties, you can set the validation methods for each value, and the fields to be ignored. <br><br>\r\nIt also has a debugging system to learn about any errors. It also supports the UPDATE query.', 'http://www.edoardocasella.it/uploads/FormToDbClass.rar'),
(5, '2013-04-30 13:58:18', 'Impatto ambientale', '"Impatto ambientale" is an interactive movie of pedagogical purpose.\r\nThe viewer can make a decision on the way forward, making him directly responsible for the environmental problem.\r\nThe history for this purpose uses a simple but profound example.<br><br>\r\nIn this project i was the author of the screenplay and software.</br></br>\r\n', 'http://www.liberalarte-gallipoli.it/impattoambientale/');

-- --------------------------------------------------------

--
-- Struttura della tabella `g_maps`
--

CREATE TABLE IF NOT EXISTS `g_maps` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) COLLATE utf16_unicode_ci NOT NULL,
  `mapIndex` varchar(11) COLLATE utf16_unicode_ci NOT NULL,
  `data` longtext COLLATE utf16_unicode_ci NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf16 COLLATE=utf16_unicode_ci AUTO_INCREMENT=3 ;

--
-- Dump dei dati per la tabella `g_maps`
--

INSERT INTO `g_maps` (`id`, `name`, `mapIndex`, `data`) VALUES
(1, 'Perimeter', '1', 'printBlock(0, 0, 8000, 20, ''floor'', null, 11, null, true);printBlock(7550, -50, 600, 600, ''decor'', ''spaceship'', 20, null, null);printBlock(8000 - 50, 0, 50, 430, ''wall'', null, 11, null, true);\r\nprintBlock(7250, 100, 100, 100, ''decor'', ''coloredLines'', 20, null, null);printBlock(7670, 342, 9500, 100, ''floor'', null, 11, null, true);printBlock(4700, 329, 4240, 13, ''floor'', null, 11, null, true);    printBlock(7800, 277,  800, 300, ''wall_nosolid'', null, 1, null, null, false);	printBlock(4950, 0, 900, 30, ''wall_nosolid'', null, 2, null, false);  \r\n	printBlock(4950, 30, 100, 30, ''wall_nosolid'', null, 2, null, false);  \r\n	printBlock(4950, 60, 100, 30, ''wall_nosolid'', null, 2, null, false); \r\n	printBlock(4950, 90, 100, 30, ''wall_nosolid'', null, 2, null, false);  \r\n	printBlock(5125, 30, 30, 110, ''window'', null, 15, null, false); \r\n	printBlock(5075, 30, 30, 110, ''window'', null, 15, null, false); \r\n	printBlock(4950, 120, 100, 30, ''wall_nosolid'', null, 2, null, false); \r\n	printBlock(5150, 30, 100, 30, ''wall_nosolid'', null, 2, null, false); \r\n	printBlock(5150, 60, 100, 30, ''wall_nosolid'', null, 2, null, false); \r\n	printBlock(5150, 90, 100, 30, ''wall_nosolid'', null, 2, null, false);\r\n	printBlock(5275, 30, 30, 110, ''window'', null, 15, null, false); \r\n	printBlock(5325, 30, 30, 110, ''window'', null, 15, null, false); \r\n	printBlock(5150, 120, 100, 30, ''wall_nosolid'', null, 2, null, false);\r\n	printBlock(5350, 30, 100, 30, ''wall_nosolid'', null, 2, null, false);\r\n	printBlock(5350, 60, 100, 30, ''wall_nosolid'', null, 2, null, false);\r\n	printBlock(5350, 90, 100, 30, ''wall_nosolid'', null, 2, null, false);\r\n	printBlock(5475, 30, 30, 110, ''window'', null, 15, null, false); \r\n	printBlock(5525, 30, 30, 110, ''window'', null, 15, null, false);\r\n	printBlock(5350, 120, 100, 30, ''wall_nosolid'', null, 2, null, false);\r\n	printBlock(5550, 30, 100, 30, ''wall_nosolid'', null, 2, null, false);\r\n	printBlock(5550, 60, 100, 30, ''wall_nosolid'', null, 2, null, false);\r\n	printBlock(5550, 90, 100, 30, ''wall_nosolid'', null, 2, null, false); \r\n	printBlock(5675, 30, 30, 110, ''window'', null, 15, null, false); \r\n	printBlock(5550, 120, 100, 30, ''wall_nosolid'', null, 2, null, false); \r\n	printBlock(5750, 30, 100, 30, ''wall_nosolid'', null, 2, null, false);\r\n	printBlock(5750, 60, 100, 30, ''wall_nosolid'', null, 2, null, false); \r\n	printBlock(5750, 90, 100, 30, ''wall_nosolid'', null, 2, null, false); \r\n	printBlock(5725, 30, 30, 110, ''window'', null, 15, null, false); \r\n	printBlock(5750, 120, 100, 30, ''wall_nosolid'', null, 2, null, false); \r\n	printBlock(4950, 150, 900, 170, ''wall_nosolid'', null, 2, null, false);printBlock(4950, 0, 25, 320, ''wall_nosolid'', null, 15, null, false); \r\n	printBlock(5000, 0, 25, 320, ''wall_nosolid'', null, 15, null, false);\r\n	printBlock(5050, 0, 25, 320, ''wall_nosolid'', null, 15, null, false);\r\n	printBlock(5100, 0, 25, 320, ''wall_nosolid'', null, 15, null, false);\r\n	printBlock(5150, 0, 25, 320, ''wall_nosolid'', null, 15, null, false);\r\n	printBlock(5200, 0, 25, 320, ''wall_nosolid'', null, 15, null, false);\r\n	printBlock(5250, 0, 25, 320, ''wall_nosolid'', null, 15, null, false);\r\n	printBlock(5300, 0, 25, 320, ''wall_nosolid'', null, 15, null, false);\r\n	printBlock(5350, 0, 25, 320, ''wall_nosolid'', null, 15, null, false);\r\n	printBlock(5400, 0, 25, 320, ''wall_nosolid'', null, 15, null, false);\r\n	printBlock(5450, 0, 25, 320, ''wall_nosolid'', null, 15, null, false);\r\n	printBlock(5500, 0, 25, 320, ''wall_nosolid'', null, 15, null, false);\r\n	printBlock(5550, 0, 25, 320, ''wall_nosolid'', null, 15, null, false);\r\n	printBlock(5600, 0, 25, 320, ''wall_nosolid'', null, 15, null, false); \r\n	printBlock(5650, 0, 25, 320, ''wall_nosolid'', null, 15, null, false);\r\n	printBlock(5700, 0, 25, 320, ''wall_nosolid'', null, 15, null, false);\r\n	printBlock(5750, 0, 25, 320, ''wall_nosolid'', null, 15, null, false); \r\n	printBlock(5800, 0, 25, 320, ''wall_nosolid'', null, 15, null, false); \r\n	printBlock(4200, 140, 850, 20, ''floor'', null, 15, null, true);\r\n	printBlock(4260, 160, 110, 20, ''wall_nosolid'', null, 15, null, false);\r\n	printBlock(4270, 180, 90, 15, ''wall_nosolid'', null, 9, null, false); \r\n	printBlock(4200, 140, 30, 150, ''wall_nosolid'', null, 9, null, false);\r\n	printBlock(4400, 140, 30, 150, ''wall_nosolid'', null, 9, null, false);\r\n	printBlock(4600, 140, 30, 150, ''wall_nosolid'', null, 9, null, false);\r\n	printBlock(4800, 140, 30, 150, ''wall_nosolid'', null, 9, null, false);\r\n	printBlock(4750, 120, 200, 20, ''floor'', null, 15, null, true); \r\n	printBlock(4780, 100, 170, 20, ''floor'', null, 15, null, true);\r\n	printBlock(4820, 80, 140, 20, ''floor'', null, 15, null, true); \r\n	printBlock(4400, 150, 334, 25, ''decor'', ''wires'', 0, null, false);\r\n	printBlock(4000, 0, 50, 150, ''wall'', null, 8, null, false);  \r\n	printBlock(4325, 245, 50, 150, ''decor'', ''tsmoke'', 0, null, false); \r\n	printBlock(3700, 50, 300, 150, ''wall'', null, 8, null, false);\r\n	printBlock(3300, 100, 400, 30, ''wall_nosolid'', null, 10, null, false);\r\n	printBlock(7610, 316, 1290, 13, ''floor'', null, 11, null, true); \r\n	printBlock(7650, 303, 1220, 19, ''floor'', null, 11, null, true); \r\n	printBlock(7690, 290, 1160, 19, ''floor'', null, 11, null, true); \r\n	printBlock(7730, 277, 1100, 19, ''floor'', null, 11, null, true); \r\n	printBlock(800, 280, 37, 45, ''barrell'', null, 11, null, true);  \r\n	printBlock(6590, 340, 1210, 100, ''wall_nosolid'', null, 12, null, false);\r\n	printBlock(7355, 300, 32, 32, ''decor'', ''metalbox1'', 10, null, false);\r\n	printBlock(7800, 277, 1020, 25, ''floor'', null, 2, null, true);\r\n	printBlock(7250, 0, 100, 330, ''wall_nosolid'', null, 9, null, false);  \r\n	printBlock(7050, 0, 100, 330, ''wall_nosolid'', null, 9, null, false);  \r\n	printBlock(6980, 290, 50, 100, ''wall'', null, 8, null, false); \r\n	printBlock(6250, 25, 2550, 50, ''wall_nosolid'', null, 9, null, false);	printBlock(6250, 100, 160, 20, ''wall_nosolid'', null, 12, null, false);\r\n	printBlock(6250, 150, 120, 20, ''wall_nosolid'', null, 12, null, false);  \r\n	printBlock(5900, 310, 700, 5, ''wall_nosolid'', null, 12, null, false); \r\n	printBlock(6600, 310, 5, 50, ''wall_nosolid'', null, 12, null, false);  \r\n	printBlock(5900, 310, 5, 20, ''wall_nosolid'', null, 12, null, false);  \r\n	printBlock(2900, 280,  3000, 300, ''wall_nosolid'', null, 12, null, null);\r\n	printBlock(5900, 310, 65, 20, ''floor'', null, 11, null, true); \r\n	printBlock(5900, 295, 45, 20, ''floor'', null, 11, null, true); \r\n	printBlock(2900, 280, 3025, 20, ''floor'', null, 11, null, true); \r\n	printBlock(6300, 35, 100, 28, ''wires1'', null, 10, null, false); \r\n	printBlock(6250, 0, 50, 255, ''wall'', null, 8, null, false);  \r\n	printBlock(5850, 20, 80, 120, ''window'', null, 15, null, false); \r\n	printBlock(5930, 0, 20, 150, ''wall'', null, 8, null, false); \r\n	printBlock(4200, 90, 50, 50, ''wall'', null, 8, null, false);  \r\n	printBlock(4950, 140, 1000, 20, ''floor'', null, 11, null, true);\r\n	printBlock(2950, -40, 528, 375, ''decor'', ''cannon'', 8, null, true); \r\n	printBlock(2800, 280, 200, 20, ''floor'', null, 11, null, true); \r\n	printBlock(2750, 300, 150, 20, ''floor'', null, 11, null, true); \r\n	printBlock(2700, 320, 300, 20, ''floor'', null, 11, null, true);\r\n	printBlock(2650, 340, 300, 20, ''floor'', null, 11, null, true);\r\n	printBlock(2600, 360, 300, 20, ''floor'', null, 11, null, true); \r\n	printBlock(2550, 380, 350, 20, ''floor'', null, 11, null, true);\r\n	printBlock(2500, 400, 400, 20, ''floor'', null, 11, null, true);\r\n	printBlock(0, 420, 3500, 20, ''floor'', null, 11, null, true);\r\n	printBlock(3110, 230, 50, 60, ''wall'', null, 8, null, false);printBlock(4895, 50, 28, 25, ''item'', ''healthBox'', 12, [*interaction*<healthBox>], false);\r\nprintBlock(6220, 280, 50, 60, ''wall'', null, 10, [*interaction*<movable>], false);'),
(2, 'Stairs of death', 'S1', 'printBlock(0, 350, 5000, 120, ''floor'', null, 10, null, true);\r\n    printBlock(0, 0, 50, 430, ''wall'', null, 8, null, true); \r\n    printBlock(0, 320, 400, 30, ''floor'', null, 10, null, true); \r\n    printBlock(0, 290, 350, 30, ''floor'', null, 10, null, true); \r\n    printBlock(0, 260, 300, 30, ''floor'', null, 10, null, true); \r\n    printBlock(0, 230, 250, 30, ''floor'', null, 10, null, true); \r\n    printBlock(0, 200, 200, 30, ''floor'', null, 10, null, true); \r\n    printBlock(550, 320, 1000, 30, ''floor'', null, 10, null, true);\r\n    printBlock(600, 290, 900, 30, ''floor'', null, 10, null, true); \r\n    printBlock(650, 260, 800, 30, ''floor'', null, 10, null, true); \r\n    printBlock(700, 230, 700, 30, ''floor'', null, 10, null, true); \r\n    printBlock(750, 200, 600, 30, ''floor'', null, 10, null, true); \r\n    printBlock(1799, 140, 200, 20, ''movable_floor'', null, 10, null, true); \r\n    printBlock(2050, 320, 1000, 30, ''floor'', null, 10, null, true); \r\n    printBlock(2100, 290, 900, 30, ''floor'', null, 10, null, true); \r\n    printBlock(2150, 260, 800, 30, ''floor'', null, 10, null, true); \r\n    printBlock(2200, 230, 700, 30, ''floor'', null, 10, null, true); \r\n    printBlock(2250, 200, 600, 30, ''floor'', null, 10, null, true); \r\n    printBlock(3050, 320, 1000, 30, ''floor'', null, 10, null, true);\r\n    printBlock(3100, 290, 900, 30, ''floor'', null, 10, null, true); \r\n    printBlock(3150, 260, 800, 30, ''floor'', null, 10, null, true); \r\n    printBlock(3200, 230, 700, 30, ''floor'', null, 10, null, true); \r\n    printBlock(3250, 200, 600, 30, ''floor'', null, 10, null, true); \r\n    printBlock(4950, 0, 50, 430, ''wall'', null, 8, null, true); \r\n    printBlock(4600, 300, 50, 50, ''wall'', null, 8, null, false); \r\nprintBlock(4770, 270, 200, 20, ''floor'', null, 10, null, true); \r\nprintBlock(4803, 250, 70, 28, ''teleporter'', null, 8, [*xval*<450>*yval*<20>], false); ');

-- --------------------------------------------------------

--
-- Struttura della tabella `g_points`
--

CREATE TABLE IF NOT EXISTS `g_points` (
  `id_player` int(11) NOT NULL,
  `points` int(11) NOT NULL,
  `mapTitle` varchar(255) COLLATE latin1_general_ci NOT NULL
) ENGINE=MyISAM DEFAULT CHARSET=latin1 COLLATE=latin1_general_ci;

--
-- Dump dei dati per la tabella `g_points`
--

INSERT INTO `g_points` (`id_player`, `points`, `mapTitle`) VALUES
(195, 6430, 'Stairs of death'),
(196, 811, 'Stairs of death'),
(197, 0, ''),
(198, 0, ''),
(199, 0, ''),
(200, 0, ''),
(201, 0, '');

-- --------------------------------------------------------

--
-- Struttura della tabella `g_saves`
--

CREATE TABLE IF NOT EXISTS `g_saves` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `id_player` int(11) NOT NULL,
  `level` int(11) NOT NULL,
  `health` int(11) NOT NULL,
  `inventary` text COLLATE utf16_unicode_ci NOT NULL,
  `weapons` text COLLATE utf16_unicode_ci NOT NULL,
  `points` int(11) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf16 COLLATE=utf16_unicode_ci AUTO_INCREMENT=48 ;

--
-- Dump dei dati per la tabella `g_saves`
--

INSERT INTO `g_saves` (`id`, `id_player`, `level`, `health`, `inventary`, `weapons`, `points`) VALUES
(36, 195, 1, 100, '0', '', 0),
(40, 195, 2, 80, 'healthBox:1:Health box ( 10);', '1:-1;', 0),
(41, 196, 1, 100, '', '1:-1', 0),
(42, 196, 2, 90, 'healthBox:2:Health box ( 10);', '1:-1;', 0),
(43, 197, 1, 100, '0', '', 0),
(44, 198, 1, 100, '0', '', 0),
(45, 199, 1, 100, '0', '', 0),
(46, 200, 1, 100, '0', '', 0),
(47, 201, 1, 100, '0', '', 0);

-- --------------------------------------------------------

--
-- Struttura della tabella `g_users`
--

CREATE TABLE IF NOT EXISTS `g_users` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `playernick` varchar(255) COLLATE utf16_unicode_ci NOT NULL,
  `playerid` int(11) NOT NULL,
  `playermail` varchar(255) COLLATE utf16_unicode_ci NOT NULL,
  `playerpassword` varchar(255) COLLATE utf16_unicode_ci NOT NULL,
  `date` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf16 COLLATE=utf16_unicode_ci AUTO_INCREMENT=202 ;

--
-- Dump dei dati per la tabella `g_users`
--

INSERT INTO `g_users` (`id`, `playernick`, `playerid`, `playermail`, `playerpassword`, `date`) VALUES
(195, 'EvanMarlowe', 0, 'evanmarlowe@hotmail.it', '97c14c073cc07c382b2597d80430afb8', '2013-12-02 11:26:04'),
(196, 'test', 0, 'test@hotmail.it', 'cd49762509406c148024f4fe684f1522', '2013-12-02 11:41:18'),
(197, 'ble', 0, 'ble@ble.pt', '7bbfdcf7c08de638f06f0d85a0b95fc9', '2013-12-02 14:21:30'),
(198, 'CasDes', 0, 'bruno_07_@hotmail.it', '8bc7c49f7449125e3819be0dd04892bf', '2013-12-02 19:15:22'),
(199, 'gabrielfan', 0, 'gabrielfan@live.it', 'f7bbb3b6e9fb38b00ca1aa3eee679d20', '2013-12-02 20:37:07'),
(200, 'noob', 0, 'noob@hotmail.it', 'cd5d7c1f561df1ce1c73668fb0b7f5b2', '2013-12-02 21:32:09'),
(201, 'micio', 0, 'alessandro.micelli@email.it', '8a2ce90975ec44a8cf1e46f9f1e5fdfd', '2013-12-05 12:56:19');

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
