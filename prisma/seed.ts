import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  const settlementTypeOne = await prisma.settlementTypes.create({
    data: {
      name: 'Großwohnsiedlung',
      description: 'Description for SettlementType 1',
    }
  });
  const settlementTypeTwo = await prisma.settlementTypes.create({
    data: {
      name: 'Geschäftsgebäude',
      description: 'Description for SettlementType 2',
    }
  });
  const eventTypeOne = await prisma.eventTypes.create({
    data: {
      name: 'Planung',
      description: 'Beginn der Planung der Siedlung.',
    }
  });
  const eventTypeTwo = await prisma.eventTypes.create({
    data: {
      name: 'Fertigstellung',
      description: 'Fertigstellung der Siedlung.',
    }
  });
  const detailTypeOne = await prisma.detailTypes.create({
    data: {
      name: 'Fläche',
      description: 'Fläche der Siedlung',
    }
  });
  const detailTypeTwo = await prisma.detailTypes.create({
    data: {
      name: 'Einwohner',
      description: 'Derzeitige Einwohner-Anzahl der Siedlung',
    }
  });
  const resourceTypeOne = await prisma.resourceTypes.create({
    data: {
      name: 'Website',
      description: 'Website zum Datensatz.',
    }
  });
  const resourceTypeTwo = await prisma.resourceTypes.create({
    data: {
      name: 'Foto',
      description: 'Foto zum Datensatz.',
    }
  });
  const settlementOne = await prisma.settlements.create({
    data: {
      title: 'Osdorfer Born',
      description: 'Der Osdorfer Born ist eine Plattenbau-Großsiedlung in Hamburg. Sie liegt in den Stadtteilen Osdorf und Lurup, nahe der westlichen Stadtgrenze.',
      events: {
        create: {
          name: 'Planung',
          description: 'Die Siedlung wurde seit 1960 von der Neuen Heimat und mehreren Genossenschaften geplant.',
          event_date: new Date('01.01.1960'),
          eventType: {
            connect: { id: eventTypeOne.id }
          }
        }
      },
      resources: {
        create: [
          {
            name: 'Wikipedia-Artikel',
            description: 'Details bei Wikipedia.',
            url: 'https://de.wikipedia.org/wiki/Osdorfer_Born',
            resourceTypes: {
              connect: { id: resourceTypeOne.id }
            }
          }, {
            name: 'Foto',
            description: 'Abbildung "Osdorfer Born"',
            url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8e/Osdorfer_Born.JPG/1920px-Osdorfer_Born.JPG',
            resourceTypes: {
              connect: { id: resourceTypeTwo.id }
            }
          },
        ]
      },
      details: {
        create: [
          {
            name: 'Fläche in km²',
            description: '0.7',
            detailType: {
              connect: { id: detailTypeOne.id }
            }
          }, {
            name: 'Einwohner',
            description: '10552',
            detailType: {
              connect: { id: detailTypeTwo.id }
            }
          },
        ]
      },
    },
  });
  const settlementTwo = await prisma.settlements.create({
    data: {
      title: 'Lenzsiedlung',
      description: 'Die Lenzsiedlung ist eine in den 1970er und 1980er Jahren gebaute Siedlung in der Stadt Hamburg.',
      events: {
        create: {
          name: 'Fertigstellung südlicher Teil',
          description: 'Fertigstellung des südlicher Teils 1978.',
          eventType: {
            connect: { id: eventTypeTwo.id }
          }
        }
      },
      resources: {
        create: [
          {
            name: 'Wikipedia-Artikel',
            description: 'Wikipedia-Artikel zur Lenzsiedlung',
            url: 'https://de.wikipedia.org/wiki/Lenzsiedlung',
            resourceTypes: {
              connect: { id: resourceTypeOne.id }
            }
          },
          {
            name: 'Luftaufnahme',
            description: 'Luftaufnahme Lenzsiedlung',
            url: 'https://upload.wikimedia.org/wikipedia/commons/9/91/LuftLenzsiedlung.jpg',
            resourceTypes: {
              connect: { id: resourceTypeTwo.id }
            }
          },
          {
            name: 'Ansicht 1984',
            description: 'Ansicht aus 1984 von der Lenzsiedlung',
            url: 'https://upload.wikimedia.org/wikipedia/commons/e/e9/Lenzsiedlung_1984.jpg',
            resourceTypes: {
              connect: { id: resourceTypeTwo.id }
            }
          },
        ]
      },
      details: {
        create: [
          {
            name: 'Fläche in km²',
            description: '0.764',
            detailType: {
              connect: { id: detailTypeOne.id }
            }
          }, {
            name: 'Einwohner',
            description: '3000',
            detailType: {
              connect: { id: detailTypeTwo.id }
            }
          },
        ]
      }
    },
  });
  const architectOne = await prisma.architects.create({
    data: {
      name: 'Klaus Nickels'
    }
  });
  const architectTwo = await prisma.architects.create({
    data: {
      name: 'Timm Ohrt',
    }
  });
  const architectThree = await prisma.architects.create({
    data: {
      name: 'Architektengemeinschaft Schween / Streb',
    }
  });
  const tagOne = await prisma.tags.create({
    data: {
      name: 'Hamburg',
      description: 'Gebäude in Hamburg',
    }
  });
  const tagTwo = await prisma.tags.create({
    data: {
      name: 'SAGA',
      description: 'Durch die SAGA errichtet',
    }
  });
  await prisma.settlementsOnTags.create({
    data: {
      settlements: {
        connect: {
          id: settlementOne.id
        }
      },
      tags: {
        connect: {
          id: tagOne.id
        }
      },
    }
  });
  await prisma.settlementsOnTags.create({
    data: {
      settlements: {
        connect: {
          id: settlementTwo.id
        }
      },
      tags: {
        connect: {
          id: tagOne.id
        }
      },
    }
  });
  await prisma.settlementsOnTags.create({
    data: {
      settlements: {
        connect: {
          id: settlementTwo.id
        }
      },
      tags: {
        connect: {
          id: tagTwo.id
        }
      },
    }
  });
  await prisma.settlementsOnArchitects.create({
    data: {
      settlements: {
        connect: {
          id: settlementOne.id
        }
      },
      architects: {
        connect: {
          id: architectOne.id
        }
      },
    }
  });
  await prisma.settlementsOnArchitects.create({
    data: {
      settlements: {
        connect: {
          id: settlementOne.id
        }
      },
      architects: {
        connect: {
          id: architectTwo.id
        }
      },
    }
  });
  await prisma.settlementsOnArchitects.create({
    data: {
      settlements: {
        connect: {
          id: settlementTwo.id
        }
      },
      architects: {
        connect: {
          id: architectThree.id
        }
      },
    }
  });
  await prisma.settlementTypeOnArchitects.create({
    data: {
      settlementType: {
        connect: {
          id: settlementTypeTwo.id
        }
      },
      architects: {
        connect: {
          id: architectOne.id
        }
      },
    }
  });
  await prisma.settlementTypeOnArchitects.create({
    data: {
      settlementType: {
        connect: {
          id: settlementTypeOne.id
        }
      },
      architects: {
        connect: {
          id: architectOne.id
        }
      },
    }
  });
  await prisma.settlementTypeOnArchitects.create({
    data: {
      settlementType: {
        connect: {
          id: settlementTypeTwo.id
        }
      },
      architects: {
        connect: {
          id: architectTwo.id
        }
      },
    }
  });
  await prisma.settlementsOnSettlementType.create({
    data: {
      settlements: {
        connect: {
          id: settlementOne.id
        }
      },
      settlementType: {
        connect: {
          id: settlementTypeOne.id
        }
      },
    }
  });
  await prisma.settlementsOnSettlementType.create({
    data: {
      settlements: {
        connect: {
          id: settlementTwo.id
        }
      },
      settlementType: {
        connect: {
          id: settlementTypeTwo.id
        }
      },
    }
  });
  await prisma.locations.create({
    data:
    {
      name: 'Kroonhorst, 22549 Hamburg, Deutschland',
      lat: 53.5898119,
      lng: 9.8435661,
      settlement: {
        connect: { id: settlementOne.id }
      }
    },
  });
  await prisma.locations.create({
    data:
    {
      name: 'Julius-Vosseler-Straße 193, 22527 Hamburg, Deutschland',
      lat: 53.5846993,
      lng: 9.9497935,
      settlement: {
        connect: { id: settlementTwo.id }
      }
    },
  });
  await prisma.resources.create({
    data: {
      name: 'Wikipedia-Artikel zur Großwohnsiedlung',
      description: 'Resource 1 Description',
      url: 'https://de.wikipedia.org/wiki/Gro%C3%9Fwohnsiedlung',
      settlementType: {
        connect: { id: settlementTypeOne.id },
      },
      resourceTypes: {
        connect: { id: resourceTypeOne.id }
      }
    },
  });
  await prisma.resources.create({
    data: {
      name: 'Foto',
      description: 'Foto einer Großwohnsiedlung (Wohnpark Alterlaa, Wien)',
      url: 'https://upload.wikimedia.org/wikipedia/commons/7/74/Alterlaa003.JPG',
      settlementType: {
        connect: { id: settlementTypeOne.id },
      },
      resourceTypes: {
        connect: { id: resourceTypeTwo.id }
      }
    },
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });