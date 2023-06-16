import { browser } from "$app/environment";
import type { caseItem } from "$lib/interfaces/caseItem";
import type { docItem } from "$lib/interfaces/docItem";

let caseItems: Array<caseItem> = [
    {
        id: 123,
        case_number: '895123',
        address: 'Baker Street 12B',
        last_update: '21 Apr 2023',
        created_by: 2,
        status: 'new',
        doc_itmes:  [
            {
              id: 4,
              type: 'reservation',
              heading: 'Morbi hendrerit erat at vehicula cursus',
              desc: 'Fusce ut enim at odio ullamcorper bibendum id in nunc. Sed posuere est ac faucibus ultrices. Vivamus vitae dui pretium tellus suscipit lacinia eget quis orci. Suspendisse ex ante, tincidunt id erat in, efficitur ultrices lectus. Cras at placerat mauris. Nulla facilisi. Aliquam viverra, sapien at maximus luctus, massa augue finibus odio, vel iaculis libero tellus nec ante. Pellentesque rutrum risus vel ipsum suscipit feugiat.',
              sub_items: [
                {
                  id: 101,
                  label: 'Suspendisse non erat libero.',
                  checked: true
                },
                {
                  id: 102,
                  label: 'Donec tellus nulla, molestie bibendum eros quis, imperdiet consequat metus.'
                }
              ]
            },
            {
              id: 5,
              type: 'question',
              heading: 'Quisque sit amet euismod magna',
              desc: 'Sed enim nisi, vehicula eget suscipit eu, venenatis ac libero. Aliquam quis nisl imperdiet lacus blandit ultricies. Sed id magna massa.',
              sub_items: []
            }
        ]
    },
    {
        id: 456,
        case_number: '895456',
        address: 'Sunshine Valley, Copenhagen',
        last_update: '21 Apr 2023',
        created_by: 1,
        status: 'pending',
        doc_itmes:  [
          {
            id: 5,
            type: 'reservation',
            heading: 'Quisque sit amet euismod magna',
            desc: 'Fusce ut enim at odio ullamcorper bibendum id in nunc. Sed posuere est ac faucibus ultrices. Vivamus vitae dui pretium tellus suscipit lacinia eget quis orci. Suspendisse ex ante, tincidunt id erat in, efficitur ultrices lectus. Cras at placerat mauris. Nulla facilisi. Aliquam viverra, sapien at maximus luctus, massa augue finibus odio, vel iaculis libero tellus nec ante. Pellentesque rutrum risus vel ipsum suscipit feugiat.',
            sub_items: [
              {
                id: 101,
                label: 'Nunc arcu erat, dapibus quis ornare sit amet, ornare efficitur lorem.',
                checked: true
              },
              {
                id: 102,
                label: 'Suspendisse non erat libero.'
              }
            ]
          },
          {
            id: 6,
            type: 'question',
            heading: 'Praesent luctus nunc diam, at cursus urna vulputate vel',
            desc: 'Pellentesque auctor purus sem, vel rhoncus augue imperdiet at. Curabitur mattis lacus quis ligula gravida ultricies. Morbi eu turpis nec diam viverra bibendum. Sed ac odio ac ligula facilisis porta. Donec suscipit pharetra accumsan. Etiam faucibus diam arcu. Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
            sub_items: []
          },
        ]
    },
    {
        id: 789,
        case_number: '895789',
        address: 'Botev 3 str, Sofia',
        last_update: '21 Apr 2023',
        created_by: 1,
        status: 'done'
    }
] ;

let commonDocItems: Array<docItem> = [
  {
    id: 10,
    type: 'reservation',
    heading: 'Morbi hendrerit erat at vehicula cursus',
    desc: 'Lorem ipsum dolor sit amet'
  },
  {
    id: 20,
    type: 'question',
    heading: 'Lorem ipsum dolor sit amet',
    desc: 'Nunc arcu erat, dapibus quis ornare sit amet, ornare efficitur lorem.'
  },
  {
    id: 30,
    type: 'reservation',
    heading: 'Quisque sit amet euismod magna'
  },
];

class TempDB {

    private key = 'tempdb';
    constructor() {
        if (!browser)
            return;
        if (!localStorage.getItem(this.key)) {
            this.set(caseItems);
        }
    }

    public removeItem(): void {
        if (!browser)
            return;
        let db = this.get();
        db = db ? db.filter((item) => item.id !== 123) : [];
        this.set(db);
    }


    public get(): Array<caseItem>|null {
        if (!browser)
            return null;
        const dbStr = localStorage.getItem(this.key);
        return JSON.parse(dbStr ?? '[]');
    }

    public set(items: Array<caseItem>) {
        if (!browser)
            return;
        const dbStr = JSON.stringify(items);
        localStorage.setItem(this.key, dbStr);
    }
}

class TemplateDB {
  private key = 'templatedb';
  constructor() {
      if (!browser)
          return;
      if (!localStorage.getItem(this.key)) {
          this.set(commonDocItems);
      }
  }

  public removeItem(): void {
      if (!browser)
          return;
      let db = this.get();
      db = db ? db.filter((item) => item.id !== 123) : [];
      this.set(db);
  }


  public get(): Array<docItem>|null {
      if (!browser)
          return null;
      const dbStr = localStorage.getItem(this.key);
      return JSON.parse(dbStr ?? '[]');
  }

  public set(items: Array<docItem>) {
      if (!browser)
          return;
      const dbStr = JSON.stringify(items);
      localStorage.setItem(this.key, dbStr);
  }
}

export const tempdb = new TempDB();
export const templatedb = new TemplateDB();
