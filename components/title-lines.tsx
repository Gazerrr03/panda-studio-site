import { Fragment } from 'react';

type TitleLinesProps = {
  lines: readonly string[];
  className?: string;
};

export function TitleLines({
  lines,
  className = 'title-line',
}: TitleLinesProps) {
  return lines.map((line, index) => (
    <Fragment key={`${index}-${line}`}>
      <span className={className}>{line}</span>
      {index < lines.length - 1 && <br />}
    </Fragment>
  ));
}
