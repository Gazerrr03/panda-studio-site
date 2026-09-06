'use client';

import { useEffect, useRef, useState, type SubmitEvent } from 'react';
import { getPetCopy, resolvePetAnswer, type PetAnswer } from '@/content/pet';
import { useI18n } from '@/components/i18n-provider';

type PandaPetProps = {
  docked: boolean;
};

export function PandaPet({ docked }: PandaPetProps) {
  const { locale } = useI18n();
  const copy = getPetCopy(locale);
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState('');
  const [askedQuestion, setAskedQuestion] = useState('');
  const [answer, setAnswer] = useState<PetAnswer | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const panelOpen = docked && open;

  useEffect(() => {
    // On phones, opening shortcuts should not immediately open the keyboard.
    if (panelOpen && window.matchMedia('(min-width: 768px) and (hover: hover) and (pointer: fine)').matches) {
      inputRef.current?.focus({ preventScroll: true });
    }
  }, [panelOpen]);

  useEffect(() => {
    if (!panelOpen) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false);
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [panelOpen]);

  const ask = (question: string) => {
    const nextQuestion = question.trim();

    if (!nextQuestion) {
      setNotice(copy.inputEmpty);
      return;
    }

    setAskedQuestion(nextQuestion);
    setAnswer(resolvePetAnswer(copy, nextQuestion));
    setInput('');
    setNotice(null);
  };

  const handleSubmit = (event: SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();
    ask(input);
  };

  const handleToggle = () => {
    setOpen((previous) => !previous);
    setNotice(null);
  };

  return (
    <div
      className={`panda-pet${docked ? ' panda-pet--docked panda-pet--jumping' : ''}${panelOpen ? ' panda-pet--open' : ''}`}
      aria-hidden={!docked}
    >
      {docked ? (
        <button
          className="panda-pet__trigger"
          type="button"
          aria-label={panelOpen ? copy.close : copy.open}
          aria-expanded={panelOpen}
          aria-controls="panda-pet-panel"
          onClick={handleToggle}
        >
          <span className="panda-pet__character" aria-hidden="true">
            <span className="panda-pet__sprite" />
          </span>
        </button>
      ) : (
        <span className="panda-pet__character" aria-hidden="true">
          <span className="panda-pet__sprite" />
        </span>
      )}

      {docked && (
        <dialog
          open
          className="panda-pet__popover"
          id="panda-pet-panel"
          aria-labelledby="panda-pet-greeting"
          aria-hidden={!panelOpen}
          inert={!panelOpen}
        >
          <div className="panda-pet__popover-header">
            <div>
              <p className="panda-pet__greeting" id="panda-pet-greeting">{copy.greeting}</p>
            </div>
            <button
              className="panda-pet__close"
              type="button"
              aria-label={copy.close}
              onClick={() => setOpen(false)}
            >
              <span aria-hidden="true">×</span>
            </button>
          </div>

          <div className="panda-pet__section">
            <nav className="panda-pet__shortcuts" aria-label={copy.shortcutsLabel}>
              <a href="#top" onClick={() => setOpen(false)}>
                <span>01</span>{copy.shortcuts.home}
              </a>
              <a href="#records" onClick={() => setOpen(false)}>
                <span>02</span>{copy.shortcuts.records}
              </a>
            </nav>
          </div>

          <div className="panda-pet__section panda-pet__ask">
            <div className="panda-pet__suggestions">
              {copy.suggestions.map((suggestion) => (
                <button
                  key={suggestion}
                  type="button"
                  onClick={() => ask(suggestion)}
                >
                  {suggestion}
                </button>
              ))}
            </div>

            <form className="panda-pet__form" aria-label={copy.askLabel} onSubmit={handleSubmit}>
              <label htmlFor="panda-pet-question">{copy.inputLabel}</label>
              <div className="panda-pet__input-row">
                <input
                  ref={inputRef}
                  id="panda-pet-question"
                  value={input}
                  placeholder={copy.inputPlaceholder}
                  onChange={(event) => {
                    setInput(event.target.value);
                    setNotice(null);
                  }}
                />
                <button type="submit">{copy.submit}</button>
              </div>
            </form>

            {notice && <p className="panda-pet__notice" role="alert">{notice}</p>}

            {askedQuestion && (
              <output className="panda-pet__answer" aria-live="polite">
                <p className="panda-pet__answer-question">{askedQuestion}</p>
                <p>{answer?.answer ?? copy.unknownAnswer}</p>
                {answer?.link && (
                  <a href={answer.link.href} onClick={() => setOpen(false)}>
                    {answer.link.label}
                  </a>
                )}
              </output>
            )}
          </div>
        </dialog>
      )}
    </div>
  );
}
