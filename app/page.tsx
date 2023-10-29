"use client";

import { Separator } from "@/components/ui/separator";

import { DocumentTypeSelect } from "@/components/DocumentTypeSelect";
import { InputField } from "@/components/InputField";
import { ItemList } from "@/components/ItemList";
import { OutputPre } from "@/components/OutputPre";
import { FooterSection } from "@/components/ItemsDrawer";

import React, { useState } from "react";

export default function Home() {
  const [output, setOutput] = useState({
    type: "",
    slug: "",
    name: "",
    path: "",
    config: { fields: new Map() },
  });

  const [items, setItems] = useState<string[]>([]);
  const [listItems, setListItems] = useState<Map<string, any>>(new Map());
  const [allItems, setAllItems] = useState<
    (string | { type: string; value: string })[]
  >([]);

  const handleItemClick = (type: string) => {
    const timestamp = Date.now();
    const uniqueType = `${type}_${timestamp}`;

    if (type === "list") {
      setListItems((prevListItems) => {
        const newListItems = new Map(prevListItems);
        newListItems.set(uniqueType, []);
        return newListItems;
      });
      setAllItems((prevAllItems) => [
        ...prevAllItems,
        { type: "list", value: uniqueType },
      ]);
    } else {
      setItems((prevItems: string[]) => [...prevItems, uniqueType]);
      setAllItems((prevAllItems) => [...prevAllItems, uniqueType]);
    }

    setOutput((prevOutput) => {
      const newFields = new Map(prevOutput.config.fields);
      newFields.set(uniqueType, {
        type: type,
        label: {
          en: "", // Replace with the actual label
        },
        ...(type === "list" ? { fields: {} } : {}),
      });
      return {
        ...prevOutput,
        config: {
          ...prevOutput.config,
          fields: newFields,
        },
      };
    });
  };

  // Input label color map
  const fieldTypeColors = {
    string: {
      bg: "bg-rose-500/10",
      text: "text-rose-600",
    },
    text: {
      bg: "bg-sky-500/10",
      text: "text-sky-600",
    },
    wysiwyg: {
      bg: "bg-emerald-500/10",
      text: "text-emerald-600",
    },
    url: {
      bg: "bg-amber-500/10",
      text: "text-amber-600",
    },
    image: {
      bg: "bg-violet-500/10",
      text: "text-violet-600",
    },
    list: {
      bg: "bg-slate-500/10",
      text: "text-slate-600",
    },
  };

  const handleItemChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    index: number
  ) => {
    // Get the new value from the event and replace spaces with underscores
    let newValue = event.target.value.replace(/\s/g, "_");

    // Get the old value from the allItems array using the index
    const oldValue = allItems[index];

    // Check if the new value already exists in allItems or listItems
    // If it does, append a timestamp to make it unique
    if (allItems.includes(newValue) || listItems.has(newValue)) {
      newValue = `${newValue}_${Date.now()}`;
    }

    // Update the output state
    setOutput((prevOutput) => {
      // Create a new array from the entries of the fields map in the previous output
      // For each entry, check if the key matches the old value
      // If it does, replace the key with the new value
      // If it doesn't, keep the key as it is
      const newFieldsArray: Array<[string, any]> = Array.from(
        prevOutput.config.fields.entries()
      ).map(([key, value]): [string, any] => {
        if (typeof oldValue === "object" && oldValue.type === "list") {
          return key === oldValue.value ? [newValue, value] : [key, value];
        } else {
          return key === oldValue ? [newValue, value] : [key, value];
        }
      });

      const newFields = new Map(newFieldsArray);

      // Return the new output object
      return {
        ...prevOutput,
        config: {
          ...prevOutput.config,
          fields: newFields,
        },
      };
    });

    // Update the allItems state
    // For each item, check if the index matches the index of the changed item
    // If it does, replace the item with the new value
    // If it doesn't, keep the item as it is
    setAllItems((prevAllItems) =>
      prevAllItems.map((item, itemIndex) =>
        itemIndex === index ? newValue : item
      )
    );

    // If the old value is a list item, update the listItems state
    if (typeof oldValue === "object" && oldValue.type === "list") {
      setListItems((prevListItems) => {
        // Create a new map from the previous list items
        const newListItems = new Map(prevListItems);

        // Set the new value in the new list items map to the value of the old value
        newListItems.set(newValue, newListItems.get(oldValue.value));

        // Delete the old value from the new list items map
        newListItems.delete(oldValue.value);

        // Return the new list items map
        return newListItems;
      });
    }
  };

  const handleItemBlur = (
    event: React.ChangeEvent<HTMLInputElement>,
    index: number
  ) => {
    let newValue = event.target.value.replace(/\s/g, "_"); // Replace spaces with underscores
    const oldValue = allItems[index];

    // Check if the new value already exists in allItems or listItems
    if (
      allItems.some(
        (item, itemIndex) =>
          itemIndex !== index &&
          (item === newValue || (item.value && item.value === newValue))
      ) ||
      listItems.has(newValue)
    ) {
      newValue = `${newValue}_${Date.now()}`; // Append a timestamp to make it unique
    }

    setOutput((prevOutput) => {
      const newFieldsArray = Array.from(prevOutput.config.fields.entries()).map(
        ([key, value]) => {
          // Check if the item is a list item
          if (typeof oldValue === "object" && oldValue.type === "list") {
            return key === oldValue.value ? [newValue, value] : [key, value];
          } else {
            return key === oldValue ? [newValue, value] : [key, value];
          }
        }
      );
      const newFields = new Map(newFieldsArray);

      return {
        ...prevOutput,
        config: {
          ...prevOutput.config,
          fields: newFields,
        },
      };
    });

    setAllItems((prevAllItems) =>
      prevAllItems.map((item, itemIndex) =>
        itemIndex === index
          ? typeof item === "object"
            ? { type: item.type, value: newValue }
            : newValue
          : item
      )
    );

    // Check if the item is a list item
    if (typeof oldValue === "object" && oldValue.type === "list") {
      setListItems((prevListItems) => {
        const newListItems = new Map(prevListItems);
        newListItems.set(newValue, newListItems.get(oldValue.value));
        newListItems.delete(oldValue.value);
        return newListItems;
      });
    }
  };
  return (
    <main className="flex flex-col items-center w-full bg-slate-50">
      <section className="flex justify-center w-full gap-8 px-4 min-h-[calc(100vh+100vh)]">
        <div className="min-h-screen w-[60%] bg-white border border-gray-100 mt-8 rounded-t-lg">
          <div className="flex gap-4 p-4">
            <DocumentTypeSelect
              onValueChange={(value) =>
                setOutput((prevOutput) => ({ ...prevOutput, type: value }))
              }
            />
            <InputField
              id="slug"
              placeholder="slug"
              onChange={(event) =>
                setOutput((prevOutput) => ({
                  ...prevOutput,
                  slug: event.target.value,
                }))
              }
            />
            <InputField
              id="name"
              placeholder="Title"
              onChange={(event) =>
                setOutput((prevOutput) => ({
                  ...prevOutput,
                  name: event.target.value,
                }))
              }
            />
            <InputField
              id="path"
              placeholder="/"
              onChange={(event) =>
                setOutput((prevOutput) => ({
                  ...prevOutput,
                  path: event.target.value,
                }))
              }
            />
          </div>
          <div className="px-4 pb-3">
            <Separator />
          </div>
          <ItemList
            items={allItems}
            onItemChange={handleItemChange}
            onItemBlur={handleItemBlur}
            output={output}
            fieldTypeColors={fieldTypeColors}
          />
        </div>
        <div className="min-h-screen w-[40%] bg-slate-100 border- border-gray-50 mt-8 rounded-t-lg text-xs text-slate-700 p-4 pb-32">
          <OutputPre output={output} />
        </div>
      </section>
      <FooterSection onItemAdd={handleItemClick} />
    </main>
  );
}
