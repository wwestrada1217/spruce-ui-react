interface DateControlContractRowsProps {
  overlays?: boolean
  variants?: boolean
}

export function DateControlContractRows({ overlays = false, variants = false }: DateControlContractRowsProps) {
  return (
    <>
      <tr><td><code>readOnly</code></td><td><code>boolean</code></td><td><code>false</code></td><td>Preserve the value while preventing changes</td></tr>
      <tr><td><code>hidden</code></td><td><code>boolean</code></td><td><code>false</code></td><td>Remove the control from layout</td></tr>
      <tr><td><code>invalid</code></td><td><code>boolean</code></td><td><code>false</code></td><td>Expose invalid state to styling and assistive technology</td></tr>
      <tr><td><code>error / errors</code></td><td><code>string / FormValidationError[]</code></td><td>—</td><td>Render and associate accessible error feedback</td></tr>
      <tr><td><code>required</code></td><td><code>boolean</code></td><td><code>false</code></td><td>Mark the control as required</td></tr>
      <tr><td><code>touched / onTouchedChange</code></td><td><code>boolean / (touched) =&gt; void</code></td><td><code>false / —</code></td><td>Controlled blur/touched state</td></tr>
      <tr><td><code>onBlur</code></td><td><code>() =&gt; void</code></td><td>—</td><td>Called when focus leaves the control</td></tr>
      <tr><td><code>hint</code></td><td><code>string</code></td><td>—</td><td>Associated helper text shown when no error is present</td></tr>
      {variants && <tr><td><code>label / floatingLabel</code></td><td><code>string / boolean</code></td><td><code>'' / false</code></td><td>Visible field label and floating treatment</td></tr>}
      {variants && <tr><td><code>variant</code></td><td><code>'default' | 'outline' | 'outlined' | 'filled'</code></td><td><code>'default'</code></td><td>Field surface variant; outlined aliases outline</td></tr>}
      {overlays && <tr><td><code>placement</code></td><td><code>Placement</code></td><td><code>'bottom-start'</code></td><td>Preferred overlay placement</td></tr>}
      {overlays && <tr><td><code>constrainToModal</code></td><td><code>boolean</code></td><td><code>true</code></td><td>Portal the panel within the nearest modal boundary</td></tr>}
      {overlays && <tr><td><code>dismissOnScroll / dismissOnClickOutside</code></td><td><code>boolean</code></td><td><code>true</code></td><td>Configure panel dismissal</td></tr>}
    </>
  )
}
