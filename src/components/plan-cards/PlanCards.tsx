import './PlanCards.css';
import { useMemo, type CSSProperties } from 'react';
import { useI18n } from '../../i18n/i18n-context.js';
import { Icon } from '../../icons/Icon.js';
import { Button } from '../button/Button.js';

export interface PlanCardFeatureGroup {
  label: string;
  features: string[];
}

export interface PlanCardModel {
  name: string;
  icon?: string;
  badge?: string;
  tagline?: string;
  capacity?: string;
  capacityLabel?: string;
  recommended?: boolean;
  groups?: PlanCardFeatureGroup[];
  ctaLabel?: string;
  value?: string | number;
}

export interface PlanCardsProps {
  plans?: readonly PlanCardModel[];
  loading?: boolean;
  skeletonCount?: number;
  recommendedLabel?: string;
  onPlanSelect?: (plan: PlanCardModel) => void;
  className?: string;
  style?: CSSProperties;
}

/** A responsive, presentational grid of pricing and entitlement tiers. */
export function PlanCards({
  plans = [],
  loading = false,
  skeletonCount = 4,
  recommendedLabel,
  onPlanSelect,
  className = '',
  style,
}: PlanCardsProps) {
  const { t } = useI18n();
  const skeletons = useMemo(
    () => Array.from({ length: Math.max(1, skeletonCount) }, (_, index) => index),
    [skeletonCount],
  );
  const classes = ['sp-plans', loading && 'sp-plans--loading', className].filter(Boolean).join(' ');

  return (
    <div className={classes} style={style} aria-busy={loading || undefined}>
      {loading ? skeletons.map((skeleton) => (
        <div className="sp-plan sp-plan--skeleton" key={skeleton} aria-hidden="true">
          <div className="sp-sk sp-sk--chip" />
          <div className="sp-sk sp-sk--title" />
          <div className="sp-sk sp-sk--line" />
          <div className="sp-sk sp-sk--metric" />
          <div className="sp-sk sp-sk--line" />
          <div className="sp-sk sp-sk--line" />
          <div className="sp-sk sp-sk--line" />
        </div>
      )) : plans.map((plan, index) => {
        const planId = `sp-plan-${String(plan.value ?? plan.name).replace(/[^a-zA-Z0-9_-]/g, '-')}-${index}`;
        return (
          <article className={['sp-plan', plan.recommended && 'sp-plan--featured'].filter(Boolean).join(' ')} key={planId} aria-labelledby={`${planId}-name`}>
            {plan.recommended && (
              <span className="sp-plan__ribbon">
                <Icon name="check-circle" size={13} />
                {recommendedLabel ?? t('recommended')}
              </span>
            )}
            <header className="sp-plan__head">
              <span className="sp-plan__chip" aria-hidden="true"><Icon name={plan.icon ?? 'package'} size={20} /></span>
              {plan.badge && <span className="sp-plan__tier">{plan.badge}</span>}
            </header>
            <h3 className="sp-plan__name" id={`${planId}-name`}>{plan.name}</h3>
            {plan.tagline && <p className="sp-plan__tagline">{plan.tagline}</p>}
            {plan.capacity && (
              <div className="sp-plan__metric">
                <span className="sp-plan__metric-value">{plan.capacity}</span>
                <span className="sp-plan__metric-label">{plan.capacityLabel ?? 'included'}</span>
              </div>
            )}
            {plan.groups && plan.groups.length > 0 && (
              <>
                <div className="sp-plan__divider" />
                <div className="sp-plan__groups">
                  {plan.groups.map((group) => (
                    <section className="sp-group" key={group.label}>
                      <h4 className="sp-group__label">{group.label}</h4>
                      <ul className="sp-group__list">
                        {group.features.map((feature) => (
                          <li className="sp-group__item" key={feature}>
                            <span className="sp-group__tick" aria-hidden="true"><Icon name="check" size={12} /></span>
                            <span>{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </section>
                  ))}
                </div>
              </>
            )}
            {plan.ctaLabel && (
              <div className="sp-plan__cta">
                <Button
                  variant={plan.recommended ? 'primary' : 'outline'}
                  fullWidth
                  onClick={() => onPlanSelect?.(plan)}
                >
                  {plan.ctaLabel}
                </Button>
              </div>
            )}
          </article>
        );
      })}
    </div>
  );
}

export type SpPlanCardFeatureGroup = PlanCardFeatureGroup;
export type SpPlanCardModel = PlanCardModel;
export type SpPlanCardsProps = PlanCardsProps;
