/* eslint-disable no-unexpected-multiline */
import { getOmittedWordsInQuote } from '../src/helpers/ellipsisHelpers'

describe('getOmittedWordsInQuote():', () => {
  test('it gets all the omitted words in a quote with one or more ellipsis', () => {
    const checks = [
      {
        // mat 1:7 figs-ellipsis
        quote: 'Ῥοβοάμ, Ῥοβοὰμ…ἐγέννησεν τὸν Ἀβιά, Ἀβιὰ…ἐγέννησεν τὸν Ἀσάφ',
        wholeQuote: 'Ῥοβοάμ, Ῥοβοὰμ δὲ ἐγέννησεν τὸν Ἀβιά, Ἀβιὰ δὲ ἐγέννησεν τὸν Ἀσάφ',
        verseString: 'Σολομὼν δὲ ἐγέννησεν τὸν Ῥοβοάμ, Ῥοβοὰμ δὲ ἐγέννησεν τὸν Ἀβιά, Ἀβιὰ δὲ ἐγέννησεν τὸν Ἀσάφ,',
      },
      {
        // TIT 1:15 figs-metaphor
        quote: 'τοῖς…μεμιαμμένοις καὶ ἀπίστοις, οὐδὲν καθαρόν',
        wholeQuote: 'τοῖς δὲ μεμιαμμένοις καὶ ἀπίστοις, οὐδὲν καθαρόν',
        verseString: 'πάντα καθαρὰ τοῖς καθαροῖς; τοῖς δὲ μεμιαμμένοις καὶ ἀπίστοις, οὐδὲν καθαρόν; ἀλλὰ μεμίανται αὐτῶν καὶ ὁ νοῦς, καὶ ἡ συνείδησις.',
      },
      {
        // MAT 3:2 figs-metonymy
        quote: 'ἤγγικεν…ἡ…τῶν Οὐρανῶν',
        wholeQuote: 'ἤγγικεν γὰρ ἡ Βασιλεία τῶν Οὐρανῶν',
        verseString: 'λέγων, "μετανοεῖτε, ἤγγικεν γὰρ ἡ Βασιλεία τῶν Οὐρανῶν."',
      },
      {
        // MAT	12	19	hb2m	figs-metonymy	οὐδὲ…ἀκούσει τις…τὴν φωνὴν αὐτοῦ
        quote: 'οὐδὲ…ἀκούσει τις…τὴν φωνὴν αὐτοῦ',
        wholeQuote: 'οὐδὲ κραυγάσει, οὐδὲ ἀκούσει τις ἐν ταῖς πλατείαις τὴν φωνὴν αὐτοῦ',
        verseString: 'οὐκ ἐρίσει, οὐδὲ κραυγάσει, οὐδὲ ἀκούσει τις ἐν ταῖς πλατείαις τὴν φωνὴν αὐτοῦ.',
      },
      {
        // MAT	10	17	a55q	writing-connectingwords	προσέχετε…ἀπὸ…ἀνθρώπων; παραδώσουσιν
        quote: 'προσέχετε…ἀπὸ…ἀνθρώπων; παραδώσουσιν',
        wholeQuote: 'προσέχετε δὲ ἀπὸ τῶν ἀνθρώπων; παραδώσουσιν',
        verseString: 'προσέχετε δὲ ἀπὸ τῶν ἀνθρώπων; παραδώσουσιν γὰρ ὑμᾶς εἰς συνέδρια, καὶ ἐν ταῖς συναγωγαῖς αὐτῶν μαστιγώσουσιν ὑμᾶς;',
      },
      {
        // MAT	18	1	pp31	figs-metonymy	ἐν…τῇ…Βασιλεία τῶν Οὐρανῶν
        quote: 'ἐν…τῇ…Βασιλεία τῶν Οὐρανῶν',
        wholeQuote: 'ἐν ἐκείνῃ τῇ ὥρᾳ προσῆλθον οἱ μαθηταὶ τῷ Ἰησοῦ λέγοντες, "τίς ἄρα μείζων ἐστὶν ἐν τῇ Βασιλεία τῶν Οὐρανῶν',
        verseString: 'ἐν ἐκείνῃ τῇ ὥρᾳ προσῆλθον οἱ μαθηταὶ τῷ Ἰησοῦ λέγοντες, "τίς ἄρα μείζων ἐστὶν ἐν τῇ Βασιλεία τῶν Οὐρανῶν?"',
      },
      {
        // MAT	19	12	m1r9	figs-activepassive	εἰσὶν…εὐνοῦχοι, οἵτινες…εὐνουχίσθησαν ὑπὸ τῶν ἀνθρώπων
        quote: 'εἰσὶν…εὐνοῦχοι, οἵτινες…εὐνουχίσθησαν ὑπὸ τῶν ἀνθρώπων',
        wholeQuote: 'εἰσὶν γὰρ εὐνοῦχοι, οἵτινες ἐκ κοιλίας μητρὸς ἐγεννήθησαν οὕτως, καὶ εἰσὶν εὐνοῦχοι οἵτινες εὐνουχίσθησαν ὑπὸ τῶν ἀνθρώπων',
        verseString: 'εἰσὶν γὰρ εὐνοῦχοι, οἵτινες ἐκ κοιλίας μητρὸς ἐγεννήθησαν οὕτως, καὶ εἰσὶν εὐνοῦχοι οἵτινες εὐνουχίσθησαν ὑπὸ τῶν ἀνθρώπων, καὶ εἰσὶν εὐνοῦχοι οἵτινες εὐνούχισαν ἑαυτοὺς διὰ τὴν Βασιλείαν τῶν Οὐρανῶν. ὁ δυνάμενος χωρεῖν, χωρείτω."',
      },
      {
        // MAT	21	9	g73z	figs-metonymy	ὡσαννὰ…ἐν…τοῖς ὑψίστοις
        quote: 'ὡσαννὰ…ἐν…τοῖς ὑψίστοις',
        wholeQuote: 'ὡσαννὰ τῷ Υἱῷ Δαυείδ! εὐλογημένος‘ ὁ ἐρχόμενος ἐν ὀνόματι Κυρίου!’ ὡσαννὰ ἐν τοῖς ὑψίστοις',
        verseString: 'οἱ δὲ ὄχλοι οἱ προάγοντες αὐτὸν καὶ οἱ ἀκολουθοῦντες ἔκραζον λέγοντες, "ὡσαννὰ τῷ Υἱῷ Δαυείδ! εὐλογημένος‘ ὁ ἐρχόμενος ἐν ὀνόματι Κυρίου!’ ὡσαννὰ ἐν τοῖς ὑψίστοις!"',
      },
      {
        // MAT	5	29	et3n	figs-you	εἰ…ὁ ὀφθαλμός σου ὁ δεξιὸς
        quote: 'εἰ…ὁ ὀφθαλμός σου ὁ δεξιὸς',
        wholeQuote: 'εἰ δὲ ὁ ὀφθαλμός σου ὁ δεξιὸς',
        verseString: 'εἰ δὲ ὁ ὀφθαλμός σου ὁ δεξιὸς σκανδαλίζει σε, ἔξελε αὐτὸν καὶ βάλε ἀπὸ σοῦ; συμφέρει γάρ σοι ἵνα ἀπόληται ἓν τῶν μελῶν σου, καὶ μὴ ὅλον τὸ σῶμά σου βληθῇ εἰς Γέενναν.',
      },
      {
        // MAT	2	13 figs-explicit ἕως…εἴπω σοι
        quote: 'ἕως…εἴπω σοι',
        wholeQuote: 'ἕως ἂν εἴπω σοι',
        verseString: 'ἀναχωρησάντων δὲ αὐτῶν, ἰδοὺ, ἄγγελος Κυρίου φαίνεται κατ’ ὄναρ τῷ Ἰωσὴφ λέγων, "ἐγερθεὶς, παράλαβε τὸ παιδίον καὶ τὴν μητέρα αὐτοῦ καὶ φεῦγε εἰς Αἴγυπτον, καὶ ἴσθι ἐκεῖ ἕως ἂν εἴπω σοι; μέλλει γὰρ Ἡρῴδης ζητεῖν τὸ παιδίον τοῦ ἀπολέσαι αὐτό."',
      },
      {
        // COL	1	28	va1x	figs-exclusive	ἡμεῖς καταγγέλλομεν, νουθετοῦντες…διδάσκοντες…παραστήσωμεν
        quote: 'ἡμεῖς καταγγέλλομεν, νουθετοῦντες…διδάσκοντες…παραστήσωμεν',
        wholeQuote: 'ἡμεῖς καταγγέλλομεν, νουθετοῦντες πάντα ἄνθρωπον καὶ διδάσκοντες πάντα ἄνθρωπον ἐν πάσῃ σοφίᾳ, ἵνα παραστήσωμεν',
        verseString: 'ὃν ἡμεῖς καταγγέλλομεν, νουθετοῦντες πάντα ἄνθρωπον καὶ διδάσκοντες πάντα ἄνθρωπον ἐν πάσῃ σοφίᾳ, ἵνα παραστήσωμεν πάντα ἄνθρωπον τέλειον ἐν Χριστῷ.',
      },
      {
        // ROM	1	11	f3g1	figs-explicit	τι…χάρισμα…πνευματικὸν, εἰς τὸ στηριχθῆναι ὑμᾶς
        quote: 'τι…χάρισμα…πνευματικὸν, εἰς τὸ στηριχθῆναι ὑμᾶς',
        wholeQuote: 'τι μεταδῶ χάρισμα ὑμῖν πνευματικὸν, εἰς τὸ στηριχθῆναι ὑμᾶς',
        verseString: 'ἐπιποθῶ γὰρ ἰδεῖν ὑμᾶς, ἵνα τι μεταδῶ χάρισμα ὑμῖν πνευματικὸν, εἰς τὸ στηριχθῆναι ὑμᾶς;',
      },
      {
        // ROM	1	17	h38h	figs-activepassive	δικαιοσύνη…Θεοῦ…ἀποκαλύπτεται, ἐκ πίστεως εἰς πίστιν
        quote: 'δικαιοσύνη…Θεοῦ…ἀποκαλύπτεται, ἐκ πίστεως εἰς πίστιν',
        wholeQuote: 'δικαιοσύνη γὰρ Θεοῦ ἐν αὐτῷ ἀποκαλύπτεται, ἐκ πίστεως εἰς πίστιν',
        verseString: 'δικαιοσύνη γὰρ Θεοῦ ἐν αὐτῷ ἀποκαλύπτεται, ἐκ πίστεως εἰς πίστιν; καθὼς γέγραπται, "ὁ δὲ δίκαιος ἐκ πίστεως ζήσεται."',
      },
      {
        // ROM	2	24	q13d	figs-activepassive	τὸ…ὄνομα τοῦ Θεοῦ…βλασφημεῖται ἐν τοῖς ἔθνεσιν
        quote: 'τὸ…ὄνομα τοῦ Θεοῦ…βλασφημεῖται ἐν τοῖς ἔθνεσιν',
        wholeQuote: 'τὸ γὰρ ὄνομα τοῦ Θεοῦ δι’ ὑμᾶς βλασφημεῖται ἐν τοῖς ἔθνεσιν',
        verseString: '"τὸ γὰρ ὄνομα τοῦ Θεοῦ δι’ ὑμᾶς βλασφημεῖται ἐν τοῖς ἔθνεσιν", καθὼς γέγραπται.',
      },
      {
        // ROM	4	12	s9jt	figs-idiom	τοῖς…στοιχοῦσιν τοῖς ἴχνεσιν τῆς…πίστεως, τοῦ πατρὸς ἡμῶν Ἀβραάμ
        quote: 'τοῖς…στοιχοῦσιν τοῖς ἴχνεσιν τῆς…πίστεως, τοῦ πατρὸς ἡμῶν Ἀβραάμ',
        wholeQuote: 'τοῖς οὐκ ἐκ περιτομῆς μόνον, ἀλλὰ καὶ τοῖς στοιχοῦσιν τοῖς ἴχνεσιν τῆς ἐν ἀκροβυστίᾳ πίστεως, τοῦ πατρὸς ἡμῶν Ἀβραάμ',
        verseString: 'καὶ πατέρα περιτομῆς τοῖς οὐκ ἐκ περιτομῆς μόνον, ἀλλὰ καὶ τοῖς στοιχοῦσιν τοῖς ἴχνεσιν τῆς ἐν ἀκροβυστίᾳ πίστεως, τοῦ πατρὸς ἡμῶν Ἀβραάμ.',
      },
      {
        // ROM	7	2	l6d9	figs-metaphor	ἡ…ὕπανδρος γυνὴ τῷ…ἀνδρὶ δέδεται νόμῳ
        quote: 'ἡ…ὕπανδρος γυνὴ τῷ…ἀνδρὶ δέδεται νόμῳ',
        wholeQuote: 'ἡ γὰρ ὕπανδρος γυνὴ τῷ ζῶντι ἀνδρὶ δέδεται νόμῳ',
        verseString: ' ἡ γὰρ ὕπανδρος γυνὴ τῷ ζῶντι ἀνδρὶ δέδεται νόμῳ; ἐὰν δὲ ἀποθάνῃ ὁ ἀνήρ, κατήργηται ἀπὸ τοῦ νόμου τοῦ ἀνδρός.',
      },
      {
        // ROM	8	19	d911	figs-personification	ἡ…ἀποκαραδοκία τῆς κτίσεως, τὴν…ἀπεκδέχεται
        quote: 'ἡ…ἀποκαραδοκία τῆς κτίσεως, τὴν…ἀπεκδέχεται',
        wholeQuote: 'ἡ γὰρ ἀποκαραδοκία τῆς κτίσεως, τὴν ἀποκάλυψιν τῶν υἱῶν τοῦ Θεοῦ ἀπεκδέχεται',
        verseString: 'ἡ γὰρ ἀποκαραδοκία τῆς κτίσεως, τὴν ἀποκάλυψιν τῶν υἱῶν τοῦ Θεοῦ ἀπεκδέχεται.',
      },
      {
        // ROM	14	7	c9ls	figs-explicit	οὐδεὶς…ἑαυτῷ…ἀποθνῄσκει
        quote: 'οὐδεὶς…ἑαυτῷ…ἀποθνῄσκει',
        wholeQuote: 'οὐδεὶς γὰρ ἡμῶν ἑαυτῷ ζῇ, καὶ οὐδεὶς ἑαυτῷ ἀποθνῄσκει',
        verseString: 'οὐδεὶς γὰρ ἡμῶν ἑαυτῷ ζῇ, καὶ οὐδεὶς ἑαυτῷ ἀποθνῄσκει.',
      },
      {
        // REV	2	18	zbx5	figs-simile	ὁ…ἔχων τοὺς ὀφθαλμοὺς…ὡς φλόγα πυρός
        quote: 'ὁ…ἔχων τοὺς ὀφθαλμοὺς…ὡς φλόγα πυρός',
        wholeQuote: 'ὁ Υἱὸς τοῦ Θεοῦ, ὁ ἔχων τοὺς ὀφθαλμοὺς αὐτοῦ ὡς φλόγα πυρός',
        verseString: 'καὶ τῷ ἀγγέλῳ τῆς ἐν Θυατείροις ἐκκλησίας γράψον: τάδε‘ λέγει ὁ Υἱὸς τοῦ Θεοῦ, ὁ ἔχων τοὺς ὀφθαλμοὺς αὐτοῦ ὡς φλόγα πυρός, καὶ οἱ πόδες αὐτοῦ ὅμοιοι χαλκολιβάνῳ:',
      },
      {
        // MAT	28	7	sp2a	figs-quotesinquotes	εἴπατε τοῖς μαθηταῖς αὐτοῦ…ἠγέρθη ἀπὸ τῶν νεκρῶν…ἰδοὺ, προάγει ὑμᾶς εἰς τὴν Γαλιλαίαν; ἐκεῖ αὐτὸν ὄψεσθε
        quote: 'εἴπατε τοῖς μαθηταῖς αὐτοῦ…ἠγέρθη ἀπὸ τῶν νεκρῶν…ἰδοὺ, προάγει ὑμᾶς εἰς τὴν Γαλιλαίαν; ἐκεῖ αὐτὸν ὄψεσθε',
        wholeQuote: 'εἴπατε τοῖς μαθηταῖς αὐτοῦ, ὅτι ἠγέρθη ἀπὸ τῶν νεκρῶν; καὶ ἰδοὺ, προάγει ὑμᾶς εἰς τὴν Γαλιλαίαν; ἐκεῖ αὐτὸν ὄψεσθε',
        verseString: 'καὶ ταχὺ πορευθεῖσαι, εἴπατε τοῖς μαθηταῖς αὐτοῦ, ὅτι ἠγέρθη ἀπὸ τῶν νεκρῶν; καὶ ἰδοὺ, προάγει ὑμᾶς εἰς τὴν Γαλιλαίαν; ἐκεῖ αὐτὸν ὄψεσθε. ἰδοὺ, εἶπον ὑμῖν."',
      },
      {
        // COL	1	9	f2xd	figs-exclusive	ἡμεῖς…ἠκούσαμεν…καὶ αἰτούμενοι
        quote: 'ἡμεῖς…ἠκούσαμεν…καὶ αἰτούμενοι',
        wholeQuote: 'ἡμεῖς, ἀφ’ ἧς ἡμέρας ἠκούσαμεν, οὐ παυόμεθα ὑπὲρ ὑμῶν προσευχόμενοι καὶ αἰτούμενοι',
        verseString: 'διὰ τοῦτο καὶ ἡμεῖς, ἀφ’ ἧς ἡμέρας ἠκούσαμεν, οὐ παυόμεθα ὑπὲρ ὑμῶν προσευχόμενοι καὶ αἰτούμενοι, ἵνα πληρωθῆτε τὴν ἐπίγνωσιν τοῦ θελήματος αὐτοῦ ἐν πάσῃ σοφίᾳ καὶ συνέσει πνευματικῇ,',
      },
      {
        // MAT 3:5 figs-metonymy
        quote: 'τότε…Ἱεροσόλυμα…πᾶσα ἡ Ἰουδαία, καὶ πᾶσα ἡ περίχωρος',
        wholeQuote: 'τότε ἐξεπορεύετο πρὸς αὐτὸν Ἱεροσόλυμα, καὶ πᾶσα ἡ Ἰουδαία, καὶ πᾶσα ἡ περίχωρος',
        verseString: 'τότε ἐξεπορεύετο πρὸς αὐτὸν Ἱεροσόλυμα, καὶ πᾶσα ἡ Ἰουδαία, καὶ πᾶσα ἡ περίχωρος τοῦ Ἰορδάνου,',
      },
      {
        // REV	9	15	b3d6	figs-parallelism	εἰς τὴν ὥραν…ἡμέραν…μῆνα, καὶ ἐνιαυτόν
        quote: 'εἰς τὴν ὥραν…ἡμέραν…μῆνα, καὶ ἐνιαυτόν',
        wholeQuote: 'εἰς τὴν ὥραν, καὶ ἡμέραν, καὶ μῆνα, καὶ ἐνιαυτόν',
        verseString: 'καὶ ἐλύθησαν οἱ τέσσαρες ἄγγελοι, οἱ ἡτοιμασμένοι εἰς τὴν ὥραν, καὶ ἡμέραν, καὶ μῆνα, καὶ ἐνιαυτόν, ἵνα ἀποκτείνωσιν τὸ τρίτον τῶν ἀνθρώπων.',
      },
      {
        // REV	12	9	pk5u	figs-distinguish	δράκων ὁ…ὄφις ὁ ἀρχαῖος…καλούμενος, Διάβολος, καὶ ὁ Σατανᾶς, ὁ πλανῶν τὴν οἰκουμένην ὅλην; ἐβλήθη εἰς τὴν γῆν, καὶ οἱ ἄγγελοι αὐτοῦ μετ’ αὐτοῦ ἐβλήθησαν
        quote: 'δράκων ὁ…ὄφις ὁ ἀρχαῖος…καλούμενος, Διάβολος, καὶ ὁ Σατανᾶς, ὁ πλανῶν τὴν οἰκουμένην ὅλην; ἐβλήθη εἰς τὴν γῆν, καὶ οἱ ἄγγελοι αὐτοῦ μετ’ αὐτοῦ ἐβλήθησαν',
        wholeQuote: 'δράκων ὁ μέγας, ὁ ὄφις ὁ ἀρχαῖος, ὁ καλούμενος, Διάβολος, καὶ ὁ Σατανᾶς, ὁ πλανῶν τὴν οἰκουμένην ὅλην; ἐβλήθη εἰς τὴν γῆν, καὶ οἱ ἄγγελοι αὐτοῦ μετ’ αὐτοῦ ἐβλήθησαν',
        verseString: 'καὶ ἐβλήθη ὁ δράκων ὁ μέγας, ὁ ὄφις ὁ ἀρχαῖος, ὁ καλούμενος, Διάβολος, καὶ ὁ Σατανᾶς, ὁ πλανῶν τὴν οἰκουμένην ὅλην; ἐβλήθη εἰς τὴν γῆν, καὶ οἱ ἄγγελοι αὐτοῦ μετ’ αὐτοῦ ἐβλήθησαν.',
      },
      {
        // MAT	3	13	zbj9	figs-activepassive	τὸν…Ἰωάννην…βαπτισθῆναι ὑπ’
        quote: 'τὸν…Ἰωάννην…βαπτισθῆναι ὑπ’',
        wholeQuote: 'τὸν Ἰορδάνην πρὸς τὸν Ἰωάννην, τοῦ βαπτισθῆναι ὑπ’',
        verseString: 'τότε παραγίνεται ὁ Ἰησοῦς ἀπὸ τῆς Γαλιλαίας ἐπὶ τὸν Ἰορδάνην πρὸς τὸν Ἰωάννην, τοῦ βαπτισθῆναι ὑπ’ αὐτοῦ.',
      },
      {
        // REV	3	17	v1pj	figs-metaphor	σὺ εἶ ὁ ταλαίπωρος…ἐλεεινὸς…πτωχὸς…τυφλὸς, καὶ γυμνός
        quote: 'σὺ εἶ ὁ ταλαίπωρος…ἐλεεινὸς…πτωχὸς…τυφλὸς, καὶ γυμνός',
        wholeQuote: 'σὺ εἶ ὁ ταλαίπωρος, καὶ ἐλεεινὸς, καὶ πτωχὸς, καὶ τυφλὸς, καὶ γυμνός',
        verseString: 'ὅτι λέγεις, ὅτι πλούσιός‘ εἰμι, καὶ πεπλούτηκα, καὶ οὐδὲν χρείαν ἔχω’, καὶ οὐκ οἶδας ὅτι σὺ εἶ ὁ ταλαίπωρος, καὶ ἐλεεινὸς, καὶ πτωχὸς, καὶ τυφλὸς, καὶ γυμνός.',
      },
      {
        // COL	2	7	e2x6	figs-idiom	ἐρριζωμένοι…ἐποικοδομούμενοι…βεβαιούμενοι…περισσεύοντες
        quote: 'ἐρριζωμένοι…ἐποικοδομούμενοι…βεβαιούμενοι…περισσεύοντες',
        wholeQuote: 'ἐρριζωμένοι καὶ ἐποικοδομούμενοι ἐν αὐτῷ, καὶ βεβαιούμενοι τῇ πίστει, καθὼς ἐδιδάχθητε, περισσεύοντες',
        verseString: 'ἐρριζωμένοι καὶ ἐποικοδομούμενοι ἐν αὐτῷ, καὶ βεβαιούμενοι τῇ πίστει, καθὼς ἐδιδάχθητε, περισσεύοντες ἐν εὐχαριστίᾳ.',
      },
      {
        // MAT	3:5 figs-metonymy	τότε…Ἱεροσόλυμα…πᾶσα ἡ Ἰουδαία, καὶ πᾶσα ἡ περίχωρος
        quote: 'τότε…Ἱεροσόλυμα…πᾶσα ἡ Ἰουδαία, καὶ πᾶσα ἡ περίχωρος',
        wholeQuote: 'τότε ἐξεπορεύετο πρὸς αὐτὸν Ἱεροσόλυμα, καὶ πᾶσα ἡ Ἰουδαία, καὶ πᾶσα ἡ περίχωρος',
        verseString: 'τότε ἐξεπορεύετο πρὸς αὐτὸν Ἱεροσόλυμα, καὶ πᾶσα ἡ Ἰουδαία, καὶ πᾶσα ἡ περίχωρος τοῦ Ἰορδάνου,',
      },
      {
        // MRK	8	12	a2x2	figs-activepassive	εἰ δοθήσεται…σημεῖον
        quote: 'εἰ δοθήσεται…σημεῖον',
        wholeQuote: 'εἰ δοθήσεται τῇ γενεᾷ ταύτῃ σημεῖον',
        verseString: 'καὶ ἀναστενάξας τῷ πνεύματι αὐτοῦ λέγει, "τί ἡ γενεὰ αὕτη ζητεῖ σημεῖον? ἀμὴν, λέγω ὑμῖν, εἰ δοθήσεται τῇ γενεᾷ ταύτῃ σημεῖον."',
      },
      {
        // MRK	15	21	rtz2	translate-names	Σίμωνα ...,Ἀλεξάνδρου…Ῥούφου
        quote: 'Σίμωνα…Ἀλεξάνδρου…Ῥούφου',
        wholeQuote: 'Σίμωνα Κυρηναῖον, ἐρχόμενον ἀπ’ ἀγροῦ, τὸν πατέρα Ἀλεξάνδρου καὶ Ῥούφου',
        verseString: 'καὶ ἀγγαρεύουσιν, παράγοντά τινα Σίμωνα Κυρηναῖον, ἐρχόμενον ἀπ’ ἀγροῦ, τὸν πατέρα Ἀλεξάνδρου καὶ Ῥούφου, ἵνα ἄρῃ τὸν σταυρὸν αὐτοῦ.',
      },
      {
        // 1th	3	6	figs-explicit	εὐαγγελισαμένου…τὴν πίστιν…ὑμῶν
        quote: 'εὐαγγελισαμένου…τὴν πίστιν…ὑμῶν',
        wholeQuote: 'εὐαγγελισαμένου ἡμῖν τὴν πίστιν καὶ τὴν ἀγάπην ὑμῶν',
        verseString: 'ἄρτι δὲ ἐλθόντος Τιμοθέου πρὸς ἡμᾶς ἀφ’ ὑμῶν, καὶ εὐαγγελισαμένου ἡμῖν τὴν πίστιν καὶ τὴν ἀγάπην ὑμῶν, καὶ ὅτι ἔχετε μνείαν ἡμῶν ἀγαθὴν πάντοτε, ἐπιποθοῦντες ἡμᾶς ἰδεῖν, καθάπερ καὶ ἡμεῖς ὑμᾶς.',
      },
      {
        // MAT  1  2  figs-ellipsis
        quote: 'Ἰσαὰκ…ἐγέννησεν…Ἰακὼβ…ἐγέννησεν',
        wholeQuote: 'Ἰσαὰκ δὲ ἐγέννησεν τὸν Ἰακώβ, Ἰακὼβ δὲ ἐγέννησεν',
        verseString: 'Ἀβραὰμ ἐγέννησεν τὸν Ἰσαάκ, Ἰσαὰκ δὲ ἐγέννησεν τὸν Ἰακώβ, Ἰακὼβ δὲ ἐγέννησεν τὸν Ἰούδαν καὶ τοὺς ἀδελφοὺς αὐτοῦ, \n',
      },
      {
        // MAT  1  3  translate-names
        quote: 'Φαρὲς…Ζάρα…Ἑσρώμ…Ἀράμ',
        wholeQuote: 'Φαρὲς καὶ τὸν Ζάρα ἐκ τῆς Θαμάρ, Φαρὲς δὲ ἐγέννησεν τὸν Ἑσρώμ, Ἑσρὼμ δὲ ἐγέννησεν τὸν Ἀράμ',
        verseString: 'Ἰούδας δὲ ἐγέννησεν τὸν Φαρὲς καὶ τὸν Ζάρα ἐκ τῆς Θαμάρ, Φαρὲς δὲ ἐγέννησεν τὸν Ἑσρώμ, Ἑσρὼμ δὲ ἐγέννησεν τὸν Ἀράμ, \n',
      },
      {
        // MAT  1  3  figs-ellipsis
        quote: 'Φαρὲς…ἐγέννησεν…Ἑσρὼμ…ἐγέννησεν',
        wholeQuote: 'Φαρὲς δὲ ἐγέννησεν τὸν Ἑσρώμ, Ἑσρὼμ δὲ ἐγέννησεν',
        verseString: 'Ἰούδας δὲ ἐγέννησεν τὸν Φαρὲς καὶ τὸν Ζάρα ἐκ τῆς Θαμάρ, Φαρὲς δὲ ἐγέννησεν τὸν Ἑσρώμ, Ἑσρὼμ δὲ ἐγέννησεν τὸν Ἀράμ, \n',
      },
      {
        // MAT  1  4  figs-ellipsis
        quote: 'Ἀμιναδὰβ…ἐγέννησεν…Ναασσὼν…ἐγέννησεν',
        wholeQuote: 'Ἀμιναδὰβ δὲ ἐγέννησεν τὸν Ναασσών, Ναασσὼν δὲ ἐγέννησεν',
        verseString: 'Ἀρὰμ δὲ ἐγέννησεν τὸν Ἀμιναδάβ, Ἀμιναδὰβ δὲ ἐγέννησεν τὸν Ναασσών, Ναασσὼν δὲ ἐγέννησεν τὸν Σαλμών, \n',
      },
      {
        // MAT  1  5  figs-ellipsis
        quote: 'Βόες…ἐγέννησεν…Ἰωβὴδ…ἐγέννησεν',
        wholeQuote: 'Βόες δὲ ἐγέννησεν τὸν Ἰωβὴδ ἐκ τῆς Ῥούθ, Ἰωβὴδ δὲ ἐγέννησεν',
        verseString: 'Σαλμὼν δὲ ἐγέννησεν τὸν Βόες ἐκ τῆς Ῥαχάβ, Βόες δὲ ἐγέννησεν τὸν Ἰωβὴδ ἐκ τῆς Ῥούθ, Ἰωβὴδ δὲ ἐγέννησεν τὸν Ἰεσσαί, \n',
      },
      {
        // MAT  1  6  figs-ellipsis
        quote: 'Δαυεὶδ…ἐγέννησεν τὸν Σολομῶνα ἐκ τῆς τοῦ Οὐρίου',
        wholeQuote: 'Δαυεὶδ δὲ ἐγέννησεν τὸν Σολομῶνα ἐκ τῆς τοῦ Οὐρίου',
        verseString: 'Ἰεσσαὶ δὲ ἐγέννησεν τὸν Δαυεὶδ τὸν βασιλέα. Δαυεὶδ δὲ ἐγέννησεν τὸν Σολομῶνα ἐκ τῆς τοῦ Οὐρίου, \n',
      },
      {
        // MAT  1  6  figs-ellipsis
        quote: 'Δαυεὶδ…ἐγέννησεν τὸν Σολομῶνα ἐκ τῆς τοῦ Οὐρίου',
        wholeQuote: 'Δαυεὶδ δὲ ἐγέννησεν τὸν Σολομῶνα ἐκ τῆς τοῦ Οὐρίου',
        verseString: 'Ἰεσσαὶ δὲ ἐγέννησεν τὸν Δαυεὶδ τὸν βασιλέα. Δαυεὶδ δὲ ἐγέννησεν τὸν Σολομῶνα ἐκ τῆς τοῦ Οὐρίου, \n',
      },
      {
        // MAT  1  7  figs-ellipsis
        quote: 'Ῥοβοὰμ…ἐγέννησεν τὸν Ἀβιά, Ἀβιὰ…ἐγέννησεν τὸν Ἀσάφ',
        wholeQuote: 'Ῥοβοὰμ δὲ ἐγέννησεν τὸν Ἀβιά, Ἀβιὰ δὲ ἐγέννησεν τὸν Ἀσάφ',
        verseString: 'Σολομὼν δὲ ἐγέννησεν τὸν Ῥοβοάμ, Ῥοβοὰμ δὲ ἐγέννησεν τὸν Ἀβιά, Ἀβιὰ δὲ ἐγέννησεν τὸν Ἀσάφ, \n',
      },
      {
        // MAT  3  5  figs-metonymy
        quote: 'τότε…Ἱεροσόλυμα, καὶ πᾶσα ἡ Ἰουδαία, καὶ πᾶσα ἡ περίχωρος',
        wholeQuote: 'τότε ἐξεπορεύετο πρὸς αὐτὸν Ἱεροσόλυμα, καὶ πᾶσα ἡ Ἰουδαία, καὶ πᾶσα ἡ περίχωρος',
        verseString: 'τότε ἐξεπορεύετο πρὸς αὐτὸν Ἱεροσόλυμα, καὶ πᾶσα ἡ Ἰουδαία, καὶ πᾶσα ἡ περίχωρος τοῦ Ἰορδάνου, \n',
      },
      {
        // MAT  9  5  figs-quotations
        quote: 'τί…ἐστιν εὐκοπώτερον εἰπεῖν, ἀφέωνται‘ σου αἱ ἁμαρτίαι’, ἢ εἰπεῖν, ἔγειρε‘ καὶ περιπάτει’?',
        wholeQuote: 'τί γάρ ἐστιν εὐκοπώτερον εἰπεῖν, ἀφέωνται‘ σου αἱ ἁμαρτίαι’, ἢ εἰπεῖν, ἔγειρε‘ καὶ περιπάτει’?',
        verseString: 'τί γάρ ἐστιν εὐκοπώτερον εἰπεῖν, ἀφέωνται‘ σου αἱ ἁμαρτίαι’, ἢ εἰπεῖν, ἔγειρε‘ καὶ περιπάτει’? \n',
      },
      {
        // MAT  13  16  figs-you
        quote: 'ὑμῶν…ὑμῶν',
        wholeQuote: 'ὑμῶν δὲ μακάριοι οἱ ὀφθαλμοὶ ὅτι βλέπουσιν, καὶ τὰ ὦτα ὑμῶν',
        verseString: 'ὑμῶν δὲ μακάριοι οἱ ὀφθαλμοὶ ὅτι βλέπουσιν, καὶ τὰ ὦτα ὑμῶν ὅτι ἀκούουσιν. \n',
      },
      {
        // MAT  27  63  figs-quotesinquotes
        quote: 'εἶπεν…‘μετὰ τρεῖς ἡμέρας ἐγείρομαι.’',
        wholeQuote: 'εἶπεν ἔτι ζῶν, ‘μετὰ τρεῖς ἡμέρας ἐγείρομαι.’',
        verseString: 'λέγοντες, "κύριε, ἐμνήσθημεν ὅτι ἐκεῖνος ὁ πλάνος εἶπεν ἔτι ζῶν, ‘μετὰ τρεῖς ἡμέρας ἐγείρομαι.’ \n',
      },
      {
        // MRK  1  27  figs-rquestion
        quote: 'συνζητεῖν πρὸς αὐτοὺς λέγοντας, "τί ἐστιν τοῦτο? διδαχὴ καινή κατ’ ἐξουσίαν!…ὑπακούουσιν αὐτῷ!"',
        wholeQuote: 'συνζητεῖν πρὸς αὐτοὺς λέγοντας, "τί ἐστιν τοῦτο? διδαχὴ καινή κατ’ ἐξουσίαν! καὶ τοῖς πνεύμασι τοῖς ἀκαθάρτοις ἐπιτάσσει, καὶ ὑπακούουσιν αὐτῷ!"',
        verseString: 'καὶ ἐθαμβήθησαν ἅπαντες, ὥστε συνζητεῖν πρὸς αὐτοὺς λέγοντας, "τί ἐστιν τοῦτο? διδαχὴ καινή κατ’ ἐξουσίαν! καὶ τοῖς πνεύμασι τοῖς ἀκαθάρτοις ἐπιτάσσει, καὶ ὑπακούουσιν αὐτῷ!" \n',
      },
      {
        // MRK  15  21  figs-ellipsis
        quote: 'Σίμωνα…Ἀλεξάνδρου…Ῥούφου',
        wholeQuote: 'Σίμωνα Κυρηναῖον, ἐρχόμενον ἀπ’ ἀγροῦ, τὸν πατέρα Ἀλεξάνδρου καὶ Ῥούφου',
        verseString: 'καὶ ἀγγαρεύουσιν, παράγοντά τινα Σίμωνα Κυρηναῖον, ἐρχόμενον ἀπ’ ἀγροῦ, τὸν πατέρα Ἀλεξάνδρου καὶ Ῥούφου, ἵνα ἄρῃ τὸν σταυρὸν αὐτοῦ. \n',
      },
      {
        // JHN  5  21  guidelines-sonofgodprinciples
        quote: 'Πατὴρ…Υἱὸς',
        wholeQuote: 'Πατὴρ ἐγείρει τοὺς νεκροὺς καὶ ζῳοποιεῖ, οὕτως καὶ ὁ Υἱὸς',
        verseString: 'ὥσπερ γὰρ ὁ Πατὴρ ἐγείρει τοὺς νεκροὺς καὶ ζῳοποιεῖ, οὕτως καὶ ὁ Υἱὸς, οὓς θέλει ζῳοποιεῖ. \n',
      },
      {
        // JHN  5  21  guidelines-sonofgodprinciples
        quote: 'Πατὴρ…Υἱὸς',
        wholeQuote: 'Πατὴρ ἐγείρει τοὺς νεκροὺς καὶ ζῳοποιεῖ, οὕτως καὶ ὁ Υἱὸς',
        verseString: 'ὥσπερ γὰρ ὁ Πατὴρ ἐγείρει τοὺς νεκροὺς καὶ ζῳοποιεῖ, οὕτως καὶ ὁ Υἱὸς, οὓς θέλει ζῳοποιεῖ. \n',
      },
      {
        // JHN  21  25  guidelines-sonofgodprinciples
        quote: 'οὐδ’ αὐτὸν…τὸν κόσμον χωρήσειν τὰ…βιβλία ',
        wholeQuote: 'οὐδ’ αὐτὸν οἶμαι τὸν κόσμον χωρήσειν τὰ γραφόμενα βιβλία',
        verseString: 'ἔστιν δὲ καὶ ἄλλα πολλὰ ἃ ἐποίησεν ὁ Ἰησοῦς, ἅτινα ἐὰν γράφηται καθ’ ἕν, οὐδ’ αὐτὸν οἶμαι τὸν κόσμον χωρήσειν τὰ γραφόμενα βιβλία. ',
      },
      {
        // ACT  4  11  figs-metaphor
        quote: 'οὗτός ἐστιν ὁ‘ λίθος…ὁ γενόμενος εἰς κεφαλὴν γωνίας’ ',
        wholeQuote: 'οὗτός ἐστιν ὁ‘ λίθος ὁ ἐξουθενηθεὶς ὑφ’ ὑμῶν, τῶν οἰκοδόμων, ὁ γενόμενος εἰς κεφαλὴν γωνίας’',
        verseString: 'οὗτός ἐστιν ὁ‘ λίθος ὁ ἐξουθενηθεὶς ὑφ’ ὑμῶν, τῶν οἰκοδόμων, ὁ γενόμενος εἰς κεφαλὴν γωνίας’. \n',
      },
      {
        // ACT  18  18  translate-symaction
        quote: 'κειράμενος…τὴν κεφαλήν, εἶχεν γὰρ εὐχήν ',
        wholeQuote: 'κειράμενος ἐν Κενχρεαῖς τὴν κεφαλήν, εἶχεν γὰρ εὐχήν',
        verseString: 'ὁ δὲ Παῦλος ἔτι προσμείνας ἡμέρας ἱκανὰς, τοῖς ἀδελφοῖς ἀποταξάμενος, ἐξέπλει εἰς τὴν Συρίαν, καὶ σὺν αὐτῷ Πρίσκιλλα καὶ Ἀκύλας, κειράμενος ἐν Κενχρεαῖς τὴν κεφαλήν, εἶχεν γὰρ εὐχήν. \n',
      },
      {
        // ACT  26  10  figs-activepassive
        quote: 'ἀναιρουμένων…αὐτῶν, κατήνεγκα ψῆφον ',
        wholeQuote: 'ἀναιρουμένων τε αὐτῶν, κατήνεγκα ψῆφον',
        verseString: ' ὃ καὶ ἐποίησα ἐν Ἱεροσολύμοις; καὶ πολλούς τε τῶν ἁγίων ἐγὼ ἐν φυλακαῖς κατέκλεισα, τὴν παρὰ τῶν ἀρχιερέων ἐξουσίαν λαβών, ἀναιρουμένων τε αὐτῶν, κατήνεγκα ψῆφον. \n',
      },
      {
        // HEB  1  13  figs-rquestion
        quote: 'πρὸς τίνα δὲ τῶν ἀγγέλων εἴρηκέν ποτε…τῶν ποδῶν σου?”',
        wholeQuote: 'πρὸς τίνα δὲ τῶν ἀγγέλων εἴρηκέν ποτε, "κάθου ἐκ δεξιῶν μου, ἕως ἂν θῶ τοὺς ἐχθρούς σου, ὑποπόδιον τῶν ποδῶν σου?"',
        verseString: 'πρὸς τίνα δὲ τῶν ἀγγέλων εἴρηκέν ποτε, "κάθου ἐκ δεξιῶν μου, ἕως ἂν θῶ τοὺς ἐχθρούς σου, ὑποπόδιον τῶν ποδῶν σου?" \n',
      },
      {
        // HEB  11  12  figs-simile
        quote: 'ἐγεννήθησαν…“καθὼς τὰ ἄστρα τοῦ οὐρανοῦ τῷ πλήθει, καὶ ὡς ἡ ἄμμος, ἡ παρὰ τὸ χεῖλος τῆς θαλάσσης, ἡ ἀναρίθμητος',
        wholeQuote: 'ἐγεννήθησαν, καὶ ταῦτα νενεκρωμένου, "καθὼς τὰ ἄστρα τοῦ οὐρανοῦ τῷ πλήθει, καὶ ὡς ἡ ἄμμος, ἡ παρὰ τὸ χεῖλος τῆς θαλάσσης, ἡ ἀναρίθμητος',
        verseString: 'διὸ καὶ ἀφ’ ἑνὸς ἐγεννήθησαν, καὶ ταῦτα νενεκρωμένου, "καθὼς τὰ ἄστρα τοῦ οὐρανοῦ τῷ πλήθει, καὶ ὡς ἡ ἄμμος, ἡ παρὰ τὸ χεῖλος τῆς θαλάσσης, ἡ ἀναρίθμητος". \n',
      },
      {
        // HEB  12  5  figs-personification
        quote: 'ἐγεννήθησαν…“καθὼς τὰ ἄστρα τοῦ οὐρανοῦ τῷ πλήθει, καὶ ὡς ἡ ἄμμος, ἡ παρὰ τὸ χεῖλος τῆς θαλάσσης, ἡ ἀναρίθμητος',
        wholeQuote: 'ἐγεννήθησαν, καὶ ταῦτα νενεκρωμένου, "καθὼς τὰ ἄστρα τοῦ οὐρανοῦ τῷ πλήθει, καὶ ὡς ἡ ἄμμος, ἡ παρὰ τὸ χεῖλος τῆς θαλάσσης, ἡ ἀναρίθμητος',
        verseString: 'διὸ καὶ ἀφ’ ἑνὸς ἐγεννήθησαν, καὶ ταῦτα νενεκρωμένου, "καθὼς τὰ ἄστρα τοῦ οὐρανοῦ τῷ πλήθει, καὶ ὡς ἡ ἄμμος, ἡ παρὰ τὸ χεῖλος τῆς θαλάσσης, ἡ ἀναρίθμητος". \n',
      },
      {
        // MRK  8  28  figs-ellipsis
        quote: 'ἄλλοι…ἄλλοι',
        wholeQuote: 'ἄλλοι Ἠλείαν, ἄλλοι',
        verseString: 'οἱ δὲ εἶπαν αὐτῷ λέγοντες, ὅτι "Ἰωάννην τὸν Βαπτιστήν, καὶ ἄλλοι Ἠλείαν, ἄλλοι δὲ ὅτι εἷς τῶν προφητῶν." \n',
      },
      {
        // MAT  10  13  figs-you
        quote: 'ὑμῶν…ὑμῶν',
        wholeQuote: 'ὑμῶν ἐπ’ αὐτήν; ἐὰν δὲ μὴ ᾖ ἀξία, ἡ εἰρήνη ὑμῶν',
        verseString: 'καὶ ἐὰν μὲν ᾖ ἡ οἰκία ἀξία, ἐλθάτω ἡ εἰρήνη ὑμῶν ἐπ’ αὐτήν; ἐὰν δὲ μὴ ᾖ ἀξία, ἡ εἰρήνη ὑμῶν πρὸς ὑμᾶς ἐπιστραφήτω. \n',
      },
      {
        // MAT  26  32  figs-activepassive
        quote: 'μετὰ…τὸ ἐγερθῆναί με',
        wholeQuote: 'μετὰ δὲ τὸ ἐγερθῆναί με',
        verseString: 'μετὰ δὲ τὸ ἐγερθῆναί με, προάξω ὑμᾶς εἰς τὴν Γαλιλαίαν." \n',
      },
      {
        // 1CO  15  55  figs-you
        quote: 'σου…σου',
        wholeQuote: 'σου, θάνατε, τὸ νῖκος? ποῦ σου',
        verseString: '"ποῦ σου, θάνατε, τὸ νῖκος? ποῦ σου, θάνατε, τὸ κέντρον?" \n',
      },
      {
        // ROM  5  8  figs-inclusive
        quote: 'ἡμῶν…ἡμῶν ',
        wholeQuote: 'ἡμῶν, Χριστὸς ὑπὲρ ἡμῶν',
        verseString: 'συνίστησιν δὲ τὴν ἑαυτοῦ ἀγάπην εἰς ἡμᾶς ὁ Θεὸς, ὅτι ἔτι ἁμαρτωλῶν ὄντων ἡμῶν, Χριστὸς ὑπὲρ ἡμῶν ἀπέθανεν. \n',
      },
      {
        // REV  13  5  figs-activepassive
        quote: 'ἐδόθη αὐτῷ…ἐδόθη αὐτῷ',
        wholeQuote: 'ἐδόθη αὐτῷ στόμα λαλοῦν μεγάλα καὶ βλασφημίας, καὶ ἐδόθη αὐτῷ',
        verseString: 'καὶ ἐδόθη αὐτῷ στόμα λαλοῦν μεγάλα καὶ βλασφημίας, καὶ ἐδόθη αὐτῷ ἐξουσία ποιῆσαι μῆνας τεσσεράκοντα δύο. \n',
      },
      {
        // ROM  7  13  figs-personification
        quote: 'ἡ ἁμαρτία…μοι κατεργαζομένη θάνατον;',
        wholeQuote: 'ἡ ἁμαρτία, ἵνα φανῇ ἁμαρτία διὰ τοῦ ἀγαθοῦ μοι κατεργαζομένη θάνατον;',
        verseString: 'τὸ οὖν ἀγαθὸν ἐμοὶ ἐγένετο θάνατος? μὴ γένοιτο! ἀλλὰ ἡ ἁμαρτία, ἵνα φανῇ ἁμαρτία διὰ τοῦ ἀγαθοῦ μοι κατεργαζομένη θάνατον; ἵνα γένηται καθ’ ὑπερβολὴν ἁμαρτωλὸς ἡ ἁμαρτία διὰ τῆς ἐντολῆς. \n',
      },
      {
        // 1CO  1  27  figs-parallelism
        quote: 'ἐξελέξατο ὁ Θεός…τοὺς σοφούς…ἐξελέξατο ὁ Θεός…τὰ ἰσχυρά',
        wholeQuote: 'ἐξελέξατο ὁ Θεός, ἵνα καταισχύνῃ τοὺς σοφούς; καὶ τὰ ἀσθενῆ τοῦ κόσμου ἐξελέξατο ὁ Θεός, ἵνα καταισχύνῃ τὰ ἰσχυρά',
        verseString: 'ἀλλὰ τὰ μωρὰ τοῦ κόσμου ἐξελέξατο ὁ Θεός, ἵνα καταισχύνῃ τοὺς σοφούς; καὶ τὰ ἀσθενῆ τοῦ κόσμου ἐξελέξατο ὁ Θεός, ἵνα καταισχύνῃ τὰ ἰσχυρά; \n',
      },
      {
        // ACT  15  38  figs-litotes
        quote: 'Παῦλος…ἠξίου…μὴ…συνπαραλαμβάνειν τοῦτον ',
        wholeQuote: 'Παῦλος δὲ ἠξίου, τὸν ἀποστάντα ἀπ’ αὐτῶν ἀπὸ Παμφυλίας καὶ μὴ συνελθόντα αὐτοῖς εἰς τὸ ἔργον, μὴ συνπαραλαμβάνειν τοῦτον',
        verseString: 'Παῦλος δὲ ἠξίου, τὸν ἀποστάντα ἀπ’ αὐτῶν ἀπὸ Παμφυλίας καὶ μὴ συνελθόντα αὐτοῖς εἰς τὸ ἔργον, μὴ συνπαραλαμβάνειν τοῦτον. \n',
      },
      {
        // 1CO  4  7  figs-you
        quote: 'σε…ἔχεις…ἔλαβες…ἔλαβες…καυχᾶσαι…λαβών',
        wholeQuote: 'σε διακρίνει? τί δὲ ἔχεις ὃ οὐκ ἔλαβες? εἰ δὲ καὶ ἔλαβες, τί καυχᾶσαι ὡς μὴ λαβών',
        verseString: 'τίς γάρ σε διακρίνει? τί δὲ ἔχεις ὃ οὐκ ἔλαβες? εἰ δὲ καὶ ἔλαβες, τί καυχᾶσαι ὡς μὴ λαβών? \n',
      },
      {
        // MAT  10  8  figs-you
        quote: 'θεραπεύετε…ἐγείρετε…καθαρίζετε…ἐκβάλλετε…ἐλάβετε…δότε',
        wholeQuote: 'θεραπεύετε, νεκροὺς ἐγείρετε, λεπροὺς καθαρίζετε, δαιμόνια ἐκβάλλετε; δωρεὰν ἐλάβετε, δωρεὰν δότε',
        verseString: 'ἀσθενοῦντας θεραπεύετε, νεκροὺς ἐγείρετε, λεπροὺς καθαρίζετε, δαιμόνια ἐκβάλλετε; δωρεὰν ἐλάβετε, δωρεὰν δότε. \n',
      },
      {
        // REV  1  11  translate-names
        quote: 'Σμύρναν…Πέργαμον…Θυάτειρα…Σάρδεις…Φιλαδέλφιαν…Λαοδίκιαν',
        wholeQuote: 'Σμύρναν, καὶ εἰς Πέργαμον, καὶ εἰς Θυάτειρα, καὶ εἰς Σάρδεις, καὶ εἰς Φιλαδέλφιαν, καὶ εἰς Λαοδίκιαν',
        verseString: 'λεγούσης, "ὃ βλέπεις γράψον εἰς βιβλίον, καὶ πέμψον ταῖς ἑπτὰ ἐκκλησίαις: εἰς Ἔφεσον, καὶ εἰς Σμύρναν, καὶ εἰς Πέργαμον, καὶ εἰς Θυάτειρα, καὶ εἰς Σάρδεις, καὶ εἰς Φιλαδέλφιαν, καὶ εἰς Λαοδίκιαν." \n',
      },
      {
        // LUK  16  10  figs-gendernotations
        quote: 'ὁ πιστὸς…καὶ…πιστός ἐστιν…ὁ…ἄδικος…καὶ…ἄδικός ἐστιν',
        wholeQuote: 'ὁ πιστὸς ἐν ἐλαχίστῳ, καὶ ἐν πολλῷ πιστός ἐστιν; καὶ ὁ ἐν ἐλαχίστῳ ἄδικος, καὶ ἐν πολλῷ ἄδικός ἐστιν',
        verseString: 'ὁ πιστὸς ἐν ἐλαχίστῳ, καὶ ἐν πολλῷ πιστός ἐστιν; καὶ ὁ ἐν ἐλαχίστῳ ἄδικος, καὶ ἐν πολλῷ ἄδικός ἐστιν. \n',
      },
      {
        // REV  21  20  translate-unknown
        quote: 'σαρδόνυξ…σάρδιον…χρυσόλιθος…βήρυλλος…τοπάζιον…χρυσόπρασος…ὑάκινθος…ἀμέθυστος',
        wholeQuote: 'σαρδόνυξ, ὁ ἕκτος σάρδιον, ὁ ἕβδομος χρυσόλιθος, ὁ ὄγδοος βήρυλλος, ὁ ἔνατος τοπάζιον, ὁ δέκατος χρυσόπρασος, ὁ ἑνδέκατος ὑάκινθος, ὁ δωδέκατος ἀμέθυστος',
        verseString: 'ὁ πέμπτος σαρδόνυξ, ὁ ἕκτος σάρδιον, ὁ ἕβδομος χρυσόλιθος, ὁ ὄγδοος βήρυλλος, ὁ ἔνατος τοπάζιον, ὁ δέκατος χρυσόπρασος, ὁ ἑνδέκατος ὑάκινθος, ὁ δωδέκατος ἀμέθυστος. \n',
      },
      {
        // MAT  5  29  figs-you
        quote: 'εἰ…σου',
        wholeQuote: 'εἰ δὲ ὁ ὀφθαλμός σου',
        verseString: 'εἰ δὲ ὁ ὀφθαλμός σου ὁ δεξιὸς σκανδαλίζει σε, ἔξελε αὐτὸν καὶ βάλε ἀπὸ σοῦ; συμφέρει γάρ σοι ἵνα ἀπόληται ἓν τῶν μελῶν σου, καὶ μὴ ὅλον τὸ σῶμά σου βληθῇ εἰς Γέενναν. \n',
      },
    ]

    checks.forEach(({ quote, verseString, wholeQuote }) => {
      const { wholeQuote: result } = getOmittedWordsInQuote(quote, verseString)
      expect(result).toEqual(wholeQuote)
    })
  })
})
