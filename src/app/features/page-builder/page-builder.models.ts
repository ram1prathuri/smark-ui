export type WidgetType = 'BUTTON' | 'ALERT' | 'DIVIDER' | 'CARD' | 'CONTAINER' | 'COLUMNS';

export interface ComponentMetadata {
  id: string;
  type: WidgetType;
  properties: Record<string, any>;
  children?: ComponentMetadata[];
}

export interface PageMetadata {
  id: string;
  title: string;
  components: ComponentMetadata[];
}

export const WIDGET_PALETTE: ComponentMetadata[] = [
  {
    id: 'template_container',
    type: 'CONTAINER',
    properties: {
      padding: '24px',
      backgroundColor: 'transparent'
    },
    children: []
  },
  {
    id: 'template_columns',
    type: 'COLUMNS',
    properties: {
      gap: '16px',
      columns: 2
    },
    children: []
  },
  {
    id: 'template_btn',
    type: 'BUTTON',
    properties: {
      label: 'Button',
      variant: 'primary',
      size: 'md',
      fullWidth: false,
      icon: ''
    }
  },
  {
    id: 'template_alert',
    type: 'ALERT',
    properties: {
      type: 'info',
      title: 'Alert Title',
      message: 'This is an alert message.'
    }
  },
  {
    id: 'template_divider',
    type: 'DIVIDER',
    properties: {
      label: 'Divider'
    }
  },
  {
    id: 'template_card',
    type: 'CARD',
    properties: {
      title: 'Card Title',
      subtitle: 'Card Subtitle',
      variant: 'elevated',
      content: 'Sample text inside the card.'
    }
  }
];
