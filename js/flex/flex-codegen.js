// js/flex/flex-codegen.js
export class FlexCodegen {
  generateHTML(state) {
    if (!state.hasAnyProperty() && !state.getGap()) return '';
    const lines = ['<div class="flex-container">'];

    for (let i = 1; i <= state.getItemCount(); i++) {
      lines.push(`  <div class="box box--${i}">BOX ${i}</div>`);
    }

    lines.push('</div>');
    return lines.join('\n');
  }

  generateCSS(state) {
    if (!state.hasAnyProperty() && !state.getGap()) return '';
    const lines = ['.flex-container {', '  display: flex;'];

    const activeProperties = state.getActiveProperties();

    Object.entries(activeProperties).forEach(([prop, value]) => {
      if (value) {
        lines.push(`  ${prop}: ${value};`);

        // ▼ align-items: stretch の場合、補足コメントを追加
        if (prop === 'align-items' && value === 'stretch') {
          const direction = state.getProperty('flex-direction');
          let hint = null;

          if (direction === 'row' || direction === 'row-reverse') {
            hint = '▼ 子にheight指定がない場合、親いっぱいに広がります（親はheight指定必須）';
          } else if (direction === 'column' || direction === 'column-reverse') {
            hint = '▼ 子にwidth指定がない場合、親いっぱいに広がります（親はwidth指定必須）';
          }

          if (hint) {
            lines.push(`  /* ${hint} */`);
          }
        }
      }
    });

    const gap = state.getGap();
    if (gap) {
      lines.push(`  gap: ${gap}px;`);
      lines.push('  /* gapはflex-directionの方向に作用します */');
    }

    lines.push('}');
    return lines.join('\n');
  }
}
