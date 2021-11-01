module.exports = function registerHook({ services, exceptions }) {
  const { MailService } = services;
  const { ServiceUnavailableException } = exceptions;

  return {
    "items.create": async function ({
      event,
      item,
      collection,
      schema,
      payload,
    }) {
      const mailService = new MailService({ schema });
      const subject = 'New ' + collection + ' created: ' + payload.name;
      const link = 'directusbase/collections/' + collection + '/' + item

      if (collection === "events") {
        try {
          await mailService.send({
            subject: subject,
            to: ["email"],
            template: {
              name: "new-event",
              data: {
                name: payload.name,
                payload: payload,
                link: link
              },
            },
          });
        } catch (error) {
          throw new ServiceUnavailableException(error);
        }
      }
    },
  };
};
