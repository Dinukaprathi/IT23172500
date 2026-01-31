// tests/transliteration.spec.ts
import { test, expect } from '@playwright/test';

test.describe('Singlish to Sinhala/Tamil Transliteration Application', () => {
  test.beforeEach(async ({ page }) => {
    try {
      await Promise.race([
        page.goto('https://www.swifttranslator.com/'),
        new Promise((_, reject) => setTimeout(() => reject(new Error('Page load timeout')), 10000))
      ]);
      await page.waitForLoadState('domcontentloaded', { timeout: 10000 });
    } catch (err) {
      await page.close();
      throw new Error('Tab closed due to slow load (>10s) or navigation failure');
    }
  });

  const cases = [
  ['Pos_UI_0001: Convert slang greeting with punctuation', 'ela machan! supiri!!', 'එල මචන්! සුපිරි!!'],
  ['Pos_UI_0002: Mixed English brand names in a question', 'mata WhatsApp ekak evanna puluvandha?', 'මට WhatsApp එකක් එවන්න පුලුවන්ද?'],
  ['Pos_UI_0003: Past tense with negation', 'mama iiyee gedhara giye naee', 'මම ඊයේ ගෙදර ගියෙ නෑ'],
  ['Pos_UI_0004: Future tense with time expression', 'api iilaGa sathiyee gedhara yamu', 'අපි ඊලඟ සතියේ ගෙදර යමු'],
  ['Pos_UI_0005: Compound sentence with cause-effect', 'oya enavaanam mama balan innavaa', 'ඔය එනවානම් මම බලන් ඉන්නවා'],
  ['Pos_UI_0006: Repeated words for emphasis with Uppercase', 'HARI HARI EKA HARI', 'හරි හරි ඒක හරි'],
  ['Pos_UI_0007: Extremely joined words (stress test)', 'mamagedharayanavaamatabathooneeapiyanavaa', 'මමගෙදරයනවාමටබත්ඕනේඅපියනවා'],
  ['Pos_UI_0008: Mixed currency, date, and time in one sentence', 'mata Rs. 7500 oonee dhesaembar 31 11.59 PM venakota', 'මට Rs. 7500 ඕනේ දෙසැම්බර් 31 11.59 PM වෙනකොට'],
  ['Pos_UI_0009: Long mixed language with slang and abbreviations', 'machan, mata meeting ekak thiyenne Zoom eke. NIC eka gena enna. ASAP kiyala kiyannam. Eka naethnam WhatsApp message ekak dhaapan. Thanks!', 'මචන්, මට meeting එකක් තියෙන්නෙ Zoom eke. NIC එක ගෙන එන්න. ASAP කියල කියන්නම්. එක නැත්නම් WhatsApp message එකක් දාපන්. Thanks!'],
  ['Pos_UI_0010: Ultra-polite request with multiple honorifics and commonly sounded word is changed', 'karuNaakaralaa vahanse, mata udhawwak karanna puLuvandhada?', 'කරුණාකරලා වහන්සෙ, මට උදව්වක් කරන්න පුළුවන්දඩ?'],
  ['Pos_UI_0011: Informal slang with exaggerated punctuation', 'adoo!! vaedak baaragaththaanam eeka hariyata karapanko bQQ!!!', 'අඩෝ!! වැඩක් බාරගත්තානම් ඒක හරියට කරපන්කො බං!!!'],
  ['Pos_UI_0012: Multi-word expression with missing vowels (typo)', 'mata  poddak inna one', 'මට පොඩ්ඩක් ඉන්න ඕනේ'],
  ['Pos_UI_0013: Question with nested English and Sinhala place names', 'siiyaa London yannadha hadhannee? nimaaliva balanna.', 'සීයා London යන්නද හදන්නේ? නිමාලිව බලන්න.'],
  ['Pos_UI_0014: Question with nested English and Sinhala place names (duplicate)', 'siiyaa London yannadha hadhannee? nimaaliva balanna.', 'සීයා London යන්නද හදන්නේ? නිමාලිව බලන්න.'],
  ['Pos_UI_0015: Negative future with uncertainty phrasing', 'mata heta enna puluvan veyidha naedhdha dhanne naee', 'මට හෙට එන්න පුලුවන් වෙයිද නැද්ද දන්නෙ නෑ'],
  ['Pos_UI_0016: Plural pronoun with mixed gender reference', 'oyaalai, eyaalai, okkoma yamu', 'ඔයාලයි, එයාලයි, ඔක්කොම යමු'],
  ['Pos_UI_0017: English tech terms embedded in complex sentence', 'Zoom meeting eke link eka ganna kalin NIC eka upload karanna', 'Zoom meeting eke link එක ගන්න කලින් NIC එක upload කරන්න'],
  ['Pos_UI_0018: Very short response with negation', 'naee', 'නෑ'],
  ['Pos_UI_0019: Detailed descriptive paragraph about daily routine', 'mama udhaeesana 6.00 AM valin aarambha karala, passe yoga karala, shower eka aran, breakfast kaalaa, passe office yanna bus ekata yanavaa. office eke mama emails check karala, meetings attend karala, saha projects manage karala dhaenma busy venavaa. passe 5.00 PM venakota gedhara enavaa, dinner kanna, saha family ekka kathaa karamu.', 'මම උදෑසන 6.00 AM වලින් ආරම්බ්හ කරල, පස්සෙ yoga කරල, shower එක අරන්, breakfast කාලා, පස්සෙ office යන්න bus එකට යනවා. office එකේ මම emails check කරල, meetings attend කරල, සහ projects manage කරල දැන්ම busy වෙනවා. පස්සෙ 5.00 PM වෙනකොට ගෙදර එනවා, dinner කන්න, සහ family එක්ක කතා කරමු.'],
  ['Pos_UI_0020: Convert multi-line input', 'mama gedhara yanavaa. oyaa enavadha?', 'මම ගෙදර යනවා. ඔයා එනවද?'],
  ['Pos_UI_0021: Fail conversion with heavy typo', 'mama gedhara yanavaa', 'මම ගෙදර යනවා'],
  ['Pos_UI_0022: Convert negative ability sentence', 'mata eeka karanna baee.', 'මට ඒක කරන්න බෑ.'],
  ['Pos_UI_0023: Convert sentence with place name', 'api trip eka Kandy valata yamudha.', 'අපි trip එක Kandy වලට යමුද.'],
  ['Pos_UI_0024: Convert long paragraph input', 'dhitvaa suLi kuNaatuva samaGa aethi vuu gQQvathura saha naayayaeem heethuven maarga sQQvarDhana aDhikaariya sathu maarga kotas 430k vinaashayata pathva aethi athara ehi samastha dhiga pramaaNaya kiloomiitar 300k pamaNa vana bava pravaahana saha mahaamaarga amaathYA sandahan kalaeya.', 'දිට්ඨව සුළි කුණාටුව සමග ඇති වූ ගංවතුර සහ නායයෑම් හේතුවෙන් මාර්ග සංවර්ධන අධිකාරිය සතු මාර්ග කොටස් 430ක් විනාශයට පත්ව ඇති අතර එහි සමස්ථ දිග ප්‍රමාණය කිලෝමීටර් 300ක් පමණ වන බව ප්‍රවාහන සහ මහමාර්ග අමාත්‍ය සඳහන් කළේය.'],
  ['Pos_UI_0025: Test the clear btn', 'Meka ayin karala balanna', 'මෙක අයින් කරල බලන්න'],
  ['Pos_UI_0026: Convert emotion expression sentence', 'mata eekata hari sathutuyi.', 'මට ඒකට හරි සතුටුයි.'],
  ['Pos_UI_0027: Convert ability statement', 'mata swim karanna puluvan', 'මට swim කරන්න පුලුවන්'],
  ['Pos_UI_0028: Convert suggestion sentence', 'api heta udhemma naegitalaa vaedakaroth ikmanata ivara karaganna puluvan', 'අපි හෙට උදෙම්ම නැගිටලා වැඩකරොත් ඉක්මනට ඉවර කරගන්න පුලුවන්'],
  ['Pos_UI_0029: Convert comparison sentence', 'meka kalin project ekata vadaa lesi ikmanata ivara karaganna puluvan.', 'මෙක කලින් project එකට වඩා ලෙසි ඉක්මනට ඉවර කරගන්න පුලුවන්.'],
  ['Pos_UI_0030: Excessive character repetition', 'oyaaaaaaa gedaaaaaa dhaaaaa yanneeee', 'ඔය ගෙදරද යන්නෙ'],
  ['Pos_UI_0031: Random capitalization', 'MaMa kuBurata yanavaa', 'මම කුඹුරට යනවා'],
  ['Pos_UI_0032: Unsupported short forms', 'thanks oyage help ekata', 'thanks ඔයගෙ උදව්වට'],
  ['Pos_UI_0033: Mixed language with symbols', 'mama!@#gedara^^^&gihin)((((***kama kannam', 'මම ගෙදර ගිහින් කැම කන්නම්'],
  ['Pos_UI_0034: Mixed language with symbols (typo tolerance)', 'mama gedhara yanava kaeema gnna passe ennam', 'මම ගෙදර යනව කෑම ග්න්න පස්සෙ එන්නම්'],
  ['Pos_UI_0035: Verify scroll behavior for long output', 'api heta nuvara yanna hithan inne. vaeda tika okkoma ivara unata passe thama yanna baluve ,oyath enavanm enna car eke ida thiyenava', 'අපි හෙට නුවර යන්න හිතන් ඉන්නේ. වැඩ ටික ඔක්කොම ඉවර උනට පස්සෙ තම යන්න බලුවෙ ,ඔයත් එනවන්ම් එන්න car eke ඉඩ තියෙනව'],
];

  for (const [i, [name, input, expectedOutput]] of cases.entries()) {
    if (i === 25) {
      test(name, async ({ page }) => {
        const inputField = page.locator('textarea[placeholder="Input Your Singlish Text Here."]');
        await inputField.fill(input);
        await page.waitForTimeout(1000);
        const outputLabel = page.locator('text=Sinhala');
        const outputField = outputLabel.locator('xpath=following-sibling::*[1]');
        await expect(outputField).not.toHaveText('', { timeout: 5000 });
        const actualOutput = await outputField.textContent();
        expect(actualOutput?.trim()).toContain(expectedOutput);
        // Now test the clear button
        const clearBtn = page.locator('button:has-text("Clear")');
        await clearBtn.click();
        await page.waitForTimeout(500);
        // Input and output should be cleared
        await expect(inputField).toHaveValue('');
        await expect(outputField).toHaveText('');
      });
    } else {
      test(name, async ({ page }) => {
        const inputField = page.locator('textarea[placeholder="Input Your Singlish Text Here."]');
        await inputField.fill(input);
        await page.waitForTimeout(1000);
        const outputLabel = page.locator('text=Sinhala');
        const outputField = outputLabel.locator('xpath=following-sibling::*[1]');
        await expect(outputField).not.toHaveText('', { timeout: 5000 });
        const actualOutput = await outputField.textContent();
        expect(actualOutput?.trim()).toContain(expectedOutput);
      });
    }
  }
});
