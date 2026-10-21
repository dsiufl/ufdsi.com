import { benefits, tiers } from "@/lib/sponsorship";

export default function TierTable() {
  return (
    <table className="site-tiers">
      <caption className="sr-only">Sponsorship tiers and what each includes</caption>
      <colgroup>
        <col />
        {tiers.map((tier) => (
          <col key={tier.name} className="is-tier" />
        ))}
      </colgroup>
      <thead>
        <tr>
          <th scope="col">Includes</th>
          {tiers.map((tier) => (
            <th key={tier.name} scope="col">
              {tier.name}
              <span>{tier.price}</span>
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {benefits.map((benefit) => (
          <tr key={benefit.text}>
            <th scope="row">{benefit.text}</th>
            {tiers.map((tier, i) => (
              <td key={tier.name}>
                {i >= benefit.from ? (
                  <span className="site-check" role="img" aria-label="Included" />
                ) : (
                  <span className="site-nope" role="img" aria-label="Not included" />
                )}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}
