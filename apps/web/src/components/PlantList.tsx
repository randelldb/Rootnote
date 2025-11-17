import { useState, useEffect } from "react";
import { data } from "react-router-dom";

export function PlantList() {
  useEffect(() => {
    fetch("/api/plants")
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
      });
  }, []);

  return <></>;
}
