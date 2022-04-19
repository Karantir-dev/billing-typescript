import es from 'react-phone-input-2/lang/es.json'
import ar from 'react-phone-input-2/lang/ar.json'
import cn from 'react-phone-input-2/lang/cn.json'
import de from 'react-phone-input-2/lang/de.json'
import fr from 'react-phone-input-2/lang/fr.json'
import hu from 'react-phone-input-2/lang/hu.json'
import id from 'react-phone-input-2/lang/id.json'
import ir from 'react-phone-input-2/lang/ir.json'
import it from 'react-phone-input-2/lang/it.json'
import jp from 'react-phone-input-2/lang/jp.json'
import ko from 'react-phone-input-2/lang/ko.json'
import pl from 'react-phone-input-2/lang/pl.json'
import pt from 'react-phone-input-2/lang/pt.json'
import ru from 'react-phone-input-2/lang/ru.json'
import tr from 'react-phone-input-2/lang/tr.json'

export const returnLanguage = lang => {
  switch (lang) {
    case 'es':
      return es
    case 'ar':
      return ar
    case 'cn':
      return cn
    case 'de':
      return de
    case 'fr':
      return fr
    case 'hu':
      return hu
    case 'id':
      return id
    case 'ir':
      return ir
    case 'it':
      return it
    case 'jp':
      return jp
    case 'ko':
      return ko
    case 'pl':
      return pl
    case 'pt':
      return pt
    case 'ru':
      return ru
    case 'tr':
      return tr
  }
}
